import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PortfolioAnalytics from '../Components/PortfolioAnalytics';
import AlertNotification from '../Components/AlertNotification';
import AlertTester from '../Components/AlertTester';
import PortfolioRebalancing from '../Components/PortfolioRebalancing';
import ExportableReports from '../Components/ExportableReports';
import SocialSharing from '../Components/SocialSharing';
import PageLayout from '../Components/PageLayout';
import { checkAlerts, loadAlerts } from '../Utils/alertHelpers';
import pushNotificationService from '../Utils/pushNotifications';

class Analytics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            triggeredAlerts: [],
            showAlerts: true,
            pushNotificationsEnabled: false
        };
    }

    async componentDidMount() {
        this.checkForTriggeredAlerts();
        // Check for alerts every 10 seconds for more responsive alerts
        this.alertInterval = setInterval(() => {
            this.checkForTriggeredAlerts();
        }, 10000);

        // Initialize push notifications
        try {
            const enabled = await pushNotificationService.initialize();
            this.setState({ pushNotificationsEnabled: enabled });
        } catch (error) {
            console.error('Failed to initialize push notifications:', error);
        }
    }

    componentWillUnmount() {
        if (this.alertInterval) {
            clearInterval(this.alertInterval);
        }
    }

    checkForTriggeredAlerts = async () => {
        try {
            const alerts = await loadAlerts();
            const triggeredAlerts = await checkAlerts(
                alerts,
                this.props.marketData,
                this.props.exchangeRate
            );

            if (triggeredAlerts.length > 0) {
                this.setState({ triggeredAlerts });

                // Send push notifications for new alerts
                if (this.state.pushNotificationsEnabled) {
                    triggeredAlerts.forEach(alert => {
                        pushNotificationService.sendAlertNotification(alert);
                    });
                }
            }
        } catch (error) {
            console.error('Failed to check alerts:', error);
        }
    };

    handleDismissAlert = (alertId) => {
        this.setState(prevState => ({
            triggeredAlerts: prevState.triggeredAlerts.filter(alert => alert.id !== alertId)
        }));
    };

    render() {
        const { triggeredAlerts, showAlerts } = this.state;
        const coinz = Object.keys(this.props.coinz).length > 0 ? this.props.coinz : false;
        const home = this.props.blockstack ? '/blockstack' : '/';

        if (!coinz) {
            return (
                <PageLayout
                    title="Portfolio Analytics"
                    currentPath="/analytics"
                    blockstack={this.props.blockstack}
                    supportedCurrencies={this.props.supportedCurrencies}
                    saveNewPref={this.props.saveNewPref}
                    language={this.props.language}
                    currency={this.props.currency}
                    addCoinz={this.props.addCoinz}
                >
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Add some coins to your portfolio to see analytics</p>
                    </div>
                </PageLayout>
            );
        }

        return (
            <PageLayout
                title="Portfolio Analytics"
                currentPath="/analytics"
                blockstack={this.props.blockstack}
                supportedCurrencies={this.props.supportedCurrencies}
                saveNewPref={this.props.saveNewPref}
                language={this.props.language}
                currency={this.props.currency}
                addCoinz={this.props.addCoinz}
            >

                {/* Show triggered alerts */}
                {showAlerts && triggeredAlerts.length > 0 && (
                    <AlertNotification
                        alerts={triggeredAlerts}
                        onDismiss={this.handleDismissAlert}
                        showAsList={true}
                        autoDismiss={false}
                    />
                )}

                {/* <AlertTester
                    marketData={this.props.marketData}
                    exchangeRate={this.props.exchangeRate}
                /> */}

                <PortfolioAnalytics
                    coinz={this.props.coinz}
                    marketData={this.props.marketData}
                    exchangeRate={this.props.exchangeRate}
                    currency={this.props.currency}
                    totalPortfolio={this.props.totalPortfolio}
                />

                {/* <PortfolioRebalancing
                    coinz={this.props.coinz}
                    marketData={this.props.marketData}
                    exchangeRate={this.props.exchangeRate}
                    currency={this.props.currency}
                /> */}

                <ExportableReports
                    coinz={this.props.coinz}
                    marketData={this.props.marketData}
                    exchangeRate={this.props.exchangeRate}
                    currency={this.props.currency}
                    totalPortfolio={this.props.totalPortfolio}
                />

                <SocialSharing
                    coinz={this.props.coinz}
                    marketData={this.props.marketData}
                    exchangeRate={this.props.exchangeRate}
                    currency={this.props.currency}
                    totalPortfolio={this.props.totalPortfolio}
                    portfolioChange={0} // TODO: Calculate actual portfolio change
                />
            </PageLayout>
        );
    }
}

export default Analytics;

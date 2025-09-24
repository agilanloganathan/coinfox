import { putFile, getFile, isUserSignedIn } from 'blockstack';
import pushNotificationService from './pushNotificationService';
import websocketService from './websocketService';
import dynamicNotificationService from './dynamicNotificationService';
import realTimeDataFetcher from './realTimeDataFetcher';
import notificationManager from './notificationManager';

// Enhanced Alert Manager with Blockstack Integration
class EnhancedAlertManager {
    constructor() {
        this.alerts = new Map();
        this.isInitialized = false;
        this.pollingInterval = null;
        this.pollingDelay = 10000; // 10 seconds
        this.storageKey = 'coinfox-alerts';
    }

    // Initialize the alert manager
    async initialize() {
        try {
            // Request notification permission
            await pushNotificationService.requestPermission();
            await dynamicNotificationService.requestPermission();

            // Load alerts from Blockstack storage
            await this.loadAlerts();

            // Start real-time data fetcher
            realTimeDataFetcher.start();

            // Subscribe to real-time data updates
            realTimeDataFetcher.subscribe(this.handleRealTimeDataUpdate.bind(this));

            // Setup WebSocket connection
            websocketService.connect();

            // Add alert callback for WebSocket
            websocketService.addAlertCallback(this.handleTriggeredAlerts.bind(this));

            // Start polling as backup
            this.startPolling();

            this.isInitialized = true;
            console.log('Enhanced Alert Manager initialized with dynamic notifications');
        } catch (error) {
            console.error('Failed to initialize Enhanced Alert Manager:', error);
        }
    }

    // Load alerts from Blockstack storage
    async loadAlerts() {
        try {
            if (!isUserSignedIn()) {
                console.log('User not signed in, using local storage');
                this.loadFromLocalStorage();
                return;
            }

            const alertsData = await getFile(this.storageKey);
            if (alertsData) {
                const alerts = JSON.parse(alertsData);
                alerts.forEach(alert => {
                    this.alerts.set(alert.id, alert);
                });
                console.log(`Loaded ${alerts.length} alerts from Blockstack`);
            }
        } catch (error) {
            console.error('Error loading alerts from Blockstack:', error);
            this.loadFromLocalStorage();
        }
    }

    // Load alerts from local storage as fallback
    loadFromLocalStorage() {
        try {
            const alertsData = localStorage.getItem(this.storageKey);
            if (alertsData) {
                const alerts = JSON.parse(alertsData);
                alerts.forEach(alert => {
                    this.alerts.set(alert.id, alert);
                });
                console.log(`Loaded ${alerts.length} alerts from local storage`);
            }
        } catch (error) {
            console.error('Error loading alerts from local storage:', error);
        }
    }

    // Save alerts to Blockstack storage
    async saveAlerts() {
        try {
            const alertsArray = Array.from(this.alerts.values());

            if (isUserSignedIn()) {
                await putFile(this.storageKey, JSON.stringify(alertsArray));
                console.log(`Saved ${alertsArray.length} alerts to Blockstack`);
            } else {
                localStorage.setItem(this.storageKey, JSON.stringify(alertsArray));
                console.log(`Saved ${alertsArray.length} alerts to local storage`);
            }
        } catch (error) {
            console.error('Error saving alerts:', error);
        }
    }

    // Add a new alert
    async addAlert(alertData) {
        try {
            const alert = {
                id: this.generateAlertId(),
                coinSymbol: alertData.coinSymbol.toUpperCase(),
                targetPrice: parseFloat(alertData.targetPrice),
                alertType: alertData.alertType, // 'above' or 'below'
                currency: alertData.currency || 'USD',
                status: 'active',
                createdAt: Date.now(),
                triggeredAt: null,
                previousPrice: null,
                currentPrice: null
            };

            this.alerts.set(alert.id, alert);
            await this.saveAlerts();

            // Subscribe to WebSocket updates for this coin
            websocketService.subscribe(alert.coinSymbol, this.handlePriceUpdate.bind(this));

            console.log('Alert added:', alert);
            return alert;
        } catch (error) {
            console.error('Error adding alert:', error);
            throw error;
        }
    }

    // Remove an alert
    async removeAlert(alertId) {
        try {
            const alert = this.alerts.get(alertId);
            if (alert) {
                this.alerts.delete(alertId);
                await this.saveAlerts();
                console.log('Alert removed:', alertId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing alert:', error);
            throw error;
        }
    }

    // Update an alert
    async updateAlert(alertId, updates) {
        try {
            const alert = this.alerts.get(alertId);
            if (alert) {
                const updatedAlert = { ...alert, ...updates };
                this.alerts.set(alertId, updatedAlert);
                await this.saveAlerts();
                console.log('Alert updated:', alertId);
                return updatedAlert;
            }
            return null;
        } catch (error) {
            console.error('Error updating alert:', error);
            throw error;
        }
    }

    // Get all alerts
    getAllAlerts() {
        return Array.from(this.alerts.values());
    }

    // Get active alerts
    getActiveAlerts() {
        return Array.from(this.alerts.values()).filter(alert => alert.status === 'active');
    }

    // Get alerts for a specific coin
    getAlertsForCoin(coinSymbol) {
        return Array.from(this.alerts.values()).filter(
            alert => alert.coinSymbol === coinSymbol.toUpperCase()
        );
    }

    // Handle price updates from WebSocket
    handlePriceUpdate(event, data) {
        if (event === 'priceUpdate') {
            const { symbol, currentPrice, previousPrice } = data;
            const coinAlerts = this.getAlertsForCoin(symbol);

            coinAlerts.forEach(alert => {
                if (alert.status === 'active') {
                    // Update alert with current price
                    alert.currentPrice = currentPrice;
                    alert.previousPrice = previousPrice;

                    // Check if alert should trigger
                    this.checkAlertTrigger(alert);
                }
            });
        }
    }

    // Check if an alert should trigger
    checkAlertTrigger(alert) {
        const { targetPrice, alertType, currentPrice } = alert;

        let shouldTrigger = false;

        if (alertType === 'above' && currentPrice >= targetPrice) {
            shouldTrigger = true;
        } else if (alertType === 'below' && currentPrice <= targetPrice) {
            shouldTrigger = true;
        }

        if (shouldTrigger) {
            this.triggerAlert(alert);
        }
    }

    // Handle real-time data updates
    handleRealTimeDataUpdate(data) {
        // Update dynamic notification service with latest market data
        dynamicNotificationService.updateMarketData(data.marketData);

        // Update portfolio data if available
        if (this.portfolioData) {
            dynamicNotificationService.updatePortfolioData(this.portfolioData);
        }
    }

    // Update portfolio data
    updatePortfolioData(portfolioData) {
        const previousData = this.portfolioData;
        this.portfolioData = portfolioData;
        dynamicNotificationService.updatePortfolioData(portfolioData);

        // Add portfolio update notification if there's a significant change
        if (previousData && previousData.totalValue && portfolioData.totalValue) {
            const changePercent = ((portfolioData.totalValue - previousData.totalValue) / previousData.totalValue) * 100;
            const changeAmount = portfolioData.totalValue - previousData.totalValue;

            // Only notify for significant changes (>1%)
            if (Math.abs(changePercent) > 1) {
                notificationManager.addPortfolioNotification({
                    totalValue: portfolioData.totalValue,
                    changePercent,
                    changeAmount,
                    currency: portfolioData.currency || 'USD'
                });
            }
        }
    }

    // Trigger an alert
    async triggerAlert(alert) {
        try {
            // Update alert status
            alert.status = 'triggered';
            alert.triggeredAt = Date.now();

            await this.saveAlerts();

            // Add to header notification dropdown
            notificationManager.addPriceAlertNotification(alert);

            // Send both regular and dynamic notifications
            await Promise.all([
                pushNotificationService.sendPriceAlertNotification(alert),
                dynamicNotificationService.sendDynamicPriceAlert(alert)
            ]);

            // Notify listeners
            this.notifyAlertTriggered(alert);

            console.log('Alert triggered with dynamic data:', alert);
        } catch (error) {
            console.error('Error triggering alert:', error);
        }
    }

    // Handle triggered alerts from WebSocket
    handleTriggeredAlerts(triggeredAlerts) {
        triggeredAlerts.forEach(alert => {
            this.triggerAlert(alert);
        });
    }

    // Notify listeners about triggered alerts
    notifyAlertTriggered(alert) {
        // This will be called by components that need to know about triggered alerts
        const event = new CustomEvent('alertTriggered', { detail: alert });
        window.dispatchEvent(event);
    }

    // Start polling as backup to WebSocket
    startPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }

        this.pollingInterval = setInterval(async () => {
            await this.pollPrices();
        }, this.pollingDelay);
    }

    // Stop polling
    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    // Poll prices from API as backup
    async pollPrices() {
        try {
            const activeAlerts = this.getActiveAlerts();
            const symbols = [...new Set(activeAlerts.map(alert => alert.coinSymbol))];

            if (symbols.length === 0) return;

            // Fetch prices from CoinGecko API
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd`
            );

            if (response.ok) {
                const prices = await response.json();

                activeAlerts.forEach(alert => {
                    const coinId = this.getCoinGeckoId(alert.coinSymbol);
                    if (prices[coinId]) {
                        const currentPrice = prices[coinId].usd;
                        const previousPrice = alert.currentPrice;

                        alert.previousPrice = previousPrice;
                        alert.currentPrice = currentPrice;

                        this.checkAlertTrigger(alert);
                    }
                });
            }
        } catch (error) {
            console.error('Error polling prices:', error);
        }
    }

    // Get CoinGecko ID for symbol
    getCoinGeckoId(symbol) {
        const symbolMap = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'ADA': 'cardano',
            'DOT': 'polkadot',
            'LINK': 'chainlink',
            'LTC': 'litecoin',
            'BCH': 'bitcoin-cash',
            'XRP': 'ripple',
            'EOS': 'eos',
            'TRX': 'tron'
        };
        return symbolMap[symbol] || symbol.toLowerCase();
    }

    // Generate unique alert ID
    generateAlertId() {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Cleanup
    destroy() {
        this.stopPolling();
        websocketService.disconnect();
        realTimeDataFetcher.stop();
        this.alerts.clear();
        this.isInitialized = false;
    }
}

// Create singleton instance
const enhancedAlertManager = new EnhancedAlertManager();

export default enhancedAlertManager;

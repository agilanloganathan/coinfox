// Push Notification Service for Price Alerts
class PushNotificationService {
    constructor() {
        this.isSupported = 'Notification' in window;
        this.permission = this.isSupported ? Notification.permission : 'denied';
        this.subscriptions = new Map();
    }

    // Request notification permission
    async requestPermission() {
        if (!this.isSupported) {
            console.warn('Notifications are not supported in this browser');
            return false;
        }

        if (this.permission === 'granted') {
            return true;
        }

        try {
            this.permission = await Notification.requestPermission();
            return this.permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    // Send a price alert notification
    async sendPriceAlertNotification(alert) {
        if (!this.isSupported || this.permission !== 'granted') {
            console.warn('Notifications not available or permission denied');
            return false;
        }

        try {
            const isIncreasing = this.getPriceDirection(alert);
            const priceChangePercent = this.getPriceChangePercent(alert);

            const notification = new Notification('🚨 Price Alert Triggered', {
                body: this.formatNotificationBody(alert, isIncreasing, priceChangePercent),
                icon: '/mobile-icon.png',
                badge: '/mobile-icon.png',
                tag: `alert-${alert.id}`,
                requireInteraction: true,
                silent: false,
                data: {
                    alertId: alert.id,
                    coinSymbol: alert.coinSymbol,
                    currentPrice: alert.currentPrice,
                    targetPrice: alert.targetPrice,
                    alertType: alert.alertType,
                    timestamp: Date.now()
                }
            });

            // Handle notification click
            notification.onclick = () => {
                window.focus();
                notification.close();
                // You can add navigation logic here
                console.log('Notification clicked for alert:', alert.id);
            };

            // Auto-close after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);

            return true;
        } catch (error) {
            console.error('Error sending notification:', error);
            return false;
        }
    }

    // Send portfolio update notification
    async sendPortfolioNotification(portfolioData) {
        if (!this.isSupported || this.permission !== 'granted') {
            return false;
        }

        try {
            const { totalValue, changePercent, changeAmount, currency } = portfolioData;
            const isPositive = changePercent >= 0;

            const notification = new Notification('📊 Portfolio Update', {
                body: `Portfolio value: ${this.formatCurrency(totalValue, currency)}\n${isPositive ? '↗️' : '↘️'} ${isPositive ? '+' : ''}${changePercent.toFixed(2)}% (${this.formatCurrency(Math.abs(changeAmount), currency)})`,
                icon: '/mobile-icon.png',
                tag: 'portfolio-update',
                requireInteraction: false,
                silent: false
            });

            setTimeout(() => notification.close(), 8000);
            return true;
        } catch (error) {
            console.error('Error sending portfolio notification:', error);
            return false;
        }
    }

    // Send market news notification
    async sendMarketNewsNotification(news) {
        if (!this.isSupported || this.permission !== 'granted') {
            return false;
        }

        try {
            const notification = new Notification('📰 Market News', {
                body: news.title,
                icon: '/mobile-icon.png',
                tag: `news-${news.id}`,
                requireInteraction: false,
                silent: false
            });

            setTimeout(() => notification.close(), 8000);
            return true;
        } catch (error) {
            console.error('Error sending news notification:', error);
            return false;
        }
    }

    // Format notification body text
    formatNotificationBody(alert, isIncreasing, priceChangePercent) {
        const coinSymbol = alert.coinSymbol;
        const currentPrice = this.formatCurrency(alert.currentPrice, alert.currency);
        const targetPrice = this.formatCurrency(alert.targetPrice, alert.currency);
        const alertType = alert.alertType === 'above' ? 'above' : 'below';

        let body = `${coinSymbol} price is now ${currentPrice}, ${alertType} your alert of ${targetPrice}`;

        if (priceChangePercent !== 0) {
            body += `\n${isIncreasing ? '↗️' : '↘️'} ${isIncreasing ? '+' : ''}${priceChangePercent.toFixed(2)}%`;
        }

        return body;
    }

    // Get price direction
    getPriceDirection(alert) {
        if (!alert.previousPrice || !alert.currentPrice) {
            return alert.alertType === 'above';
        }
        return alert.currentPrice > alert.previousPrice;
    }

    // Get price change percentage
    getPriceChangePercent(alert) {
        if (!alert.previousPrice || !alert.currentPrice) {
            return 0;
        }
        return ((alert.currentPrice - alert.previousPrice) / alert.previousPrice) * 100;
    }

    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(amount);
    }

    // Clear all notifications
    clearAllNotifications() {
        if (this.isSupported && this.permission === 'granted') {
            // Close all notifications with our tag
            // Note: This is a simplified approach - in a real app you'd track notification IDs
            console.log('Clearing all notifications');
        }
    }

    // Check if notifications are enabled
    isEnabled() {
        return this.isSupported && this.permission === 'granted';
    }

    // Get permission status
    getPermissionStatus() {
        return {
            supported: this.isSupported,
            permission: this.permission,
            enabled: this.isEnabled()
        };
    }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;

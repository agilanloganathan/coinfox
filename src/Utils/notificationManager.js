// Dynamic Notification Manager for Header Notifications
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.subscribers = new Set();
        this.maxNotifications = 50; // Keep last 50 notifications
    }

    // Add a new notification
    addNotification(notification) {
        const newNotification = {
            id: this.generateId(),
            title: notification.title,
            message: notification.message,
            type: notification.type || 'info',
            timestamp: Date.now(),
            read: false,
            data: notification.data || {}
        };

        this.notifications.unshift(newNotification); // Add to beginning
        
        // Keep only the latest notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }

        // Notify subscribers
        this.notifySubscribers();
        
        return newNotification;
    }

    // Add price alert notification
    addPriceAlertNotification(alert) {
        const isIncreasing = this.getPriceDirection(alert);
        const priceChangePercent = this.getPriceChangePercent(alert);
        
        const title = "🚨 Price Alert Triggered";
        const message = this.formatAlertMessage(alert, isIncreasing, priceChangePercent);
        
        return this.addNotification({
            title,
            message,
            type: 'price_alert',
            data: {
                alertId: alert.id,
                coinSymbol: alert.coinSymbol,
                currentPrice: alert.currentPrice,
                targetPrice: alert.targetPrice,
                alertType: alert.alertType,
                isIncreasing,
                priceChangePercent
            }
        });
    }

    // Add portfolio update notification
    addPortfolioNotification(portfolioData) {
        const { totalValue, changePercent, changeAmount, currency } = portfolioData;
        const isPositive = changePercent >= 0;
        
        const title = "📊 Portfolio Update";
        const message = `Portfolio value: ${this.formatCurrency(totalValue, currency)}\n${isPositive ? '↗️' : '↘️'} ${isPositive ? '+' : ''}${changePercent.toFixed(2)}% (${this.formatCurrency(Math.abs(changeAmount), currency)})`;
        
        return this.addNotification({
            title,
            message,
            type: 'portfolio_update',
            data: {
                totalValue,
                changePercent,
                changeAmount,
                currency,
                isPositive
            }
        });
    }

    // Add coin added notification
    addCoinAddedNotification(coinSymbol, amount) {
        const title = "➕ New Coin Added";
        const message = `${coinSymbol} has been added to your portfolio (${amount} ${coinSymbol})`;
        
        return this.addNotification({
            title,
            message,
            type: 'coin_added',
            data: {
                coinSymbol,
                amount
            }
        });
    }

    // Add market news notification
    addMarketNewsNotification(news) {
        const title = "📰 Market News";
        const message = news.title;
        
        return this.addNotification({
            title,
            message,
            type: 'market_news',
            data: {
                newsId: news.id,
                source: news.source,
                url: news.url
            }
        });
    }

    // Add system notification
    addSystemNotification(title, message, type = 'system') {
        return this.addNotification({
            title,
            message,
            type,
            data: {}
        });
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.notifySubscribers();
        }
    }

    // Mark all notifications as read
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.notifySubscribers();
    }

    // Remove notification
    removeNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.notifySubscribers();
    }

    // Clear all notifications
    clearAll() {
        this.notifications = [];
        this.notifySubscribers();
    }

    // Get all notifications
    getAllNotifications() {
        return [...this.notifications];
    }

    // Get unread notifications
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }

    // Get notifications by type
    getNotificationsByType(type) {
        return this.notifications.filter(n => n.type === type);
    }

    // Subscribe to notification updates
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    // Notify all subscribers
    notifySubscribers() {
        this.subscribers.forEach(callback => {
            try {
                callback(this.getAllNotifications());
            } catch (error) {
                console.error('Error in notification subscriber:', error);
            }
        });
    }

    // Format alert message
    formatAlertMessage(alert, isIncreasing, priceChangePercent) {
        const coinSymbol = alert.coinSymbol;
        const currentPrice = this.formatCurrency(alert.currentPrice, alert.currency);
        const targetPrice = this.formatCurrency(alert.targetPrice, alert.currency);
        const alertType = alert.alertType === 'above' ? 'above' : 'below';
        
        let message = `${coinSymbol} price is now ${currentPrice}, ${alertType} your alert of ${targetPrice}`;
        
        if (priceChangePercent !== 0) {
            const direction = isIncreasing ? '↗️' : '↘️';
            message += `\n${direction} ${isIncreasing ? '+' : ''}${priceChangePercent.toFixed(2)}%`;
        }
        
        return message;
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

    // Generate unique ID
    generateId() {
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get notification count
    getUnreadCount() {
        return this.getUnreadNotifications().length;
    }

    // Get status
    getStatus() {
        return {
            total: this.notifications.length,
            unread: this.getUnreadCount(),
            subscribers: this.subscribers.size
        };
    }
}

// Create singleton instance
const notificationManager = new NotificationManager();

export default notificationManager;


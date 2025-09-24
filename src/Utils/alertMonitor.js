/**
 * Advanced Alert Monitoring System
 * Provides real-time alert checking with optimized polling
 */

import { checkAlerts, loadAlerts } from './alertHelpers';

class AlertMonitor {
    constructor() {
        this.isRunning = false;
        this.intervalId = null;
        this.checkInterval = 10000; // 10 seconds
        this.listeners = new Set();
        this.lastMarketData = null;
        this.lastExchangeRate = null;
    }

    /**
     * Start monitoring alerts
     * @param {Object} marketData - Current market data
     * @param {number} exchangeRate - Current exchange rate
     */
    start(marketData, exchangeRate) {
        if (this.isRunning) {
            this.stop();
        }

        this.isRunning = true;
        this.lastMarketData = marketData;
        this.lastExchangeRate = exchangeRate;

        // Initial check
        this.checkAlerts();

        // Set up interval
        this.intervalId = setInterval(() => {
            this.checkAlerts();
        }, this.checkInterval);

        console.log('🚨 Alert monitoring started');
    }

    /**
     * Stop monitoring alerts
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('🚨 Alert monitoring stopped');
    }

    /**
     * Update market data and exchange rate
     * @param {Object} marketData - New market data
     * @param {number} exchangeRate - New exchange rate
     */
    updateMarketData(marketData, exchangeRate) {
        this.lastMarketData = marketData;
        this.lastExchangeRate = exchangeRate;

        // Check alerts immediately when market data updates
        if (this.isRunning) {
            this.checkAlerts();
        }
    }

    /**
     * Check for triggered alerts
     */
    async checkAlerts() {
        try {
            const alerts = await loadAlerts();
            const triggeredAlerts = await checkAlerts(
                alerts,
                this.lastMarketData,
                this.lastExchangeRate
            );

            if (triggeredAlerts.length > 0) {
                this.notifyListeners(triggeredAlerts);
            }
        } catch (error) {
            console.error('Failed to check alerts:', error);
        }
    }

    /**
     * Add a listener for triggered alerts
     * @param {Function} callback - Callback function to call when alerts are triggered
     */
    addListener(callback) {
        this.listeners.add(callback);
    }

    /**
     * Remove a listener
     * @param {Function} callback - Callback function to remove
     */
    removeListener(callback) {
        this.listeners.delete(callback);
    }

    /**
     * Notify all listeners of triggered alerts
     * @param {Array} triggeredAlerts - Array of triggered alerts
     */
    notifyListeners(triggeredAlerts) {
        this.listeners.forEach(callback => {
            try {
                callback(triggeredAlerts);
            } catch (error) {
                console.error('Error in alert listener:', error);
            }
        });
    }

    /**
     * Get current monitoring status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            checkInterval: this.checkInterval,
            listenerCount: this.listeners.size,
            hasMarketData: !!this.lastMarketData,
            hasExchangeRate: !!this.lastExchangeRate
        };
    }

    /**
     * Set custom check interval
     * @param {number} interval - Interval in milliseconds
     */
    setCheckInterval(interval) {
        this.checkInterval = Math.max(5000, interval); // Minimum 5 seconds

        if (this.isRunning) {
            this.stop();
            this.start(this.lastMarketData, this.lastExchangeRate);
        }
    }
}

// Create singleton instance
const alertMonitor = new AlertMonitor();

export default alertMonitor;

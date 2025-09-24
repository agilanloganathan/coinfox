import { putFile, getFile, isUserSignedIn } from 'blockstack';

/**
 * Alert management utilities for Coinfox portfolio alerts
 * Handles creation, storage, and triggering of price alerts
 */

// Alert status constants
export const ALERT_STATUS = {
    ACTIVE: 'active',
    TRIGGERED: 'triggered',
    DISMISSED: 'dismissed'
};

// Alert type constants
export const ALERT_TYPE = {
    ABOVE: 'above',
    BELOW: 'below'
};

// Storage key for alerts in Blockstack
const ALERTS_STORAGE_KEY = 'coinfox-alerts';

/**
 * Generate a unique ID for alerts
 */
export const generateAlertId = () => {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new price alert
 * @param {string} coinSymbol - The coin symbol (e.g., 'BTC', 'ETH')
 * @param {number} targetPrice - The target price to trigger the alert
 * @param {string} alertType - 'above' or 'below'
 * @param {string} currency - The currency for the price (e.g., 'USD')
 * @returns {Object} Alert object
 */
export const createAlert = (coinSymbol, targetPrice, alertType, currency = 'USD') => {
    return {
        id: generateAlertId(),
        coinSymbol: coinSymbol.toUpperCase(),
        targetPrice: parseFloat(targetPrice),
        alertType: alertType.toLowerCase(),
        currency: currency.toUpperCase(),
        status: ALERT_STATUS.ACTIVE,
        createdAt: new Date().toISOString(),
        triggeredAt: null,
        dismissedAt: null
    };
};

/**
 * Save alerts to Blockstack storage
 * @param {Array} alerts - Array of alert objects
 * @returns {Promise} Promise that resolves when alerts are saved
 */
export const saveAlerts = async (alerts) => {
    if (!isUserSignedIn()) {
        // Fallback to localStorage for non-authenticated users
        localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
        return Promise.resolve();
    }

    try {
        const encrypt = true;
        const data = JSON.stringify(alerts);
        await putFile(ALERTS_STORAGE_KEY, data, encrypt);
        return Promise.resolve();
    } catch (error) {
        console.error('Failed to save alerts to Blockstack:', error);
        // Fallback to localStorage
        localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
        return Promise.resolve();
    }
};

/**
 * Load alerts from Blockstack storage
 * @returns {Promise<Array>} Promise that resolves with array of alerts
 */
export const loadAlerts = async () => {
    if (!isUserSignedIn()) {
        // Fallback to localStorage for non-authenticated users
        const alerts = localStorage.getItem(ALERTS_STORAGE_KEY);
        return alerts ? JSON.parse(alerts) : [];
    }

    try {
        const decrypt = true;
        const alertsData = await getFile(ALERTS_STORAGE_KEY, decrypt);
        return alertsData ? JSON.parse(alertsData) : [];
    } catch (error) {
        console.error('Failed to load alerts from Blockstack:', error);
        // Fallback to localStorage
        const alerts = localStorage.getItem(ALERTS_STORAGE_KEY);
        return alerts ? JSON.parse(alerts) : [];
    }
};

/**
 * Add a new alert
 * @param {Object} alert - Alert object to add
 * @returns {Promise<Array>} Promise that resolves with updated alerts array
 */
export const addAlert = async (alert) => {
    const alerts = await loadAlerts();
    const updatedAlerts = [...alerts, alert];
    await saveAlerts(updatedAlerts);
    return updatedAlerts;
};

/**
 * Remove an alert by ID
 * @param {string} alertId - ID of the alert to remove
 * @returns {Promise<Array>} Promise that resolves with updated alerts array
 */
export const removeAlert = async (alertId) => {
    const alerts = await loadAlerts();
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    await saveAlerts(updatedAlerts);
    return updatedAlerts;
};

/**
 * Update an alert
 * @param {string} alertId - ID of the alert to update
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Array>} Promise that resolves with updated alerts array
 */
export const updateAlert = async (alertId, updates) => {
    const alerts = await loadAlerts();
    const updatedAlerts = alerts.map(alert =>
        alert.id === alertId ? { ...alert, ...updates } : alert
    );
    await saveAlerts(updatedAlerts);
    return updatedAlerts;
};

/**
 * Check if an alert should be triggered based on current price
 * @param {Object} alert - Alert object
 * @param {number} currentPrice - Current price of the coin
 * @returns {boolean} True if alert should be triggered
 */
export const shouldTriggerAlert = (alert, currentPrice) => {
    if (alert.status !== ALERT_STATUS.ACTIVE) {
        return false;
    }

    const price = parseFloat(currentPrice);
    const targetPrice = parseFloat(alert.targetPrice);

    if (alert.alertType === ALERT_TYPE.ABOVE) {
        return price >= targetPrice;
    } else if (alert.alertType === ALERT_TYPE.BELOW) {
        return price <= targetPrice;
    }

    return false;
};

/**
 * Check all active alerts against current market data
 * @param {Array} alerts - Array of alert objects
 * @param {Object} marketData - Current market data object
 * @param {number} exchangeRate - Exchange rate for currency conversion
 * @returns {Promise<Array>} Promise that resolves with triggered alerts
 */
export const checkAlerts = async (alerts, marketData, exchangeRate = 1) => {
    const triggeredAlerts = [];

    for (const alert of alerts) {
        if (alert.status !== ALERT_STATUS.ACTIVE) continue;

        const coinData = marketData[alert.coinSymbol.toLowerCase()];
        if (!coinData || !coinData.ticker) continue;

        const currentPrice = coinData.ticker.price * exchangeRate;

        if (shouldTriggerAlert(alert, currentPrice)) {
            // Mark alert as triggered
            await updateAlert(alert.id, {
                status: ALERT_STATUS.TRIGGERED,
                triggeredAt: new Date().toISOString()
            });

            triggeredAlerts.push({
                ...alert,
                currentPrice,
                triggeredAt: new Date().toISOString()
            });
        }
    }

    return triggeredAlerts;
};

/**
 * Dismiss a triggered alert
 * @param {string} alertId - ID of the alert to dismiss
 * @returns {Promise<Array>} Promise that resolves with updated alerts array
 */
export const dismissAlert = async (alertId) => {
    return updateAlert(alertId, {
        status: ALERT_STATUS.DISMISSED,
        dismissedAt: new Date().toISOString()
    });
};

/**
 * Get alerts filtered by status
 * @param {Array} alerts - Array of alert objects
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered alerts array
 */
export const getAlertsByStatus = (alerts, status) => {
    return alerts.filter(alert => alert.status === status);
};

/**
 * Get alerts for a specific coin
 * @param {Array} alerts - Array of alert objects
 * @param {string} coinSymbol - Coin symbol to filter by
 * @returns {Array} Filtered alerts array
 */
export const getAlertsForCoin = (alerts, coinSymbol) => {
    return alerts.filter(alert =>
        alert.coinSymbol.toLowerCase() === coinSymbol.toLowerCase()
    );
};

/**
 * Format alert message for display
 * @param {Object} alert - Alert object
 * @param {number} currentPrice - Current price of the coin
 * @returns {string} Formatted alert message
 */
export const formatAlertMessage = (alert, currentPrice) => {
    const coinSymbol = alert.coinSymbol;
    const targetPrice = alert.targetPrice;
    const currency = alert.currency;
    const alertType = alert.alertType === ALERT_TYPE.ABOVE ? 'above' : 'below';

    return `${coinSymbol} price is now ${currency} ${currentPrice.toFixed(2)}, ${alertType} your alert of ${currency} ${targetPrice.toFixed(2)}`;
};

/**
 * Validate alert data
 * @param {Object} alertData - Alert data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateAlert = (alertData) => {
    const errors = [];

    if (!alertData.coinSymbol || alertData.coinSymbol.trim() === '') {
        errors.push('Coin symbol is required');
    }

    if (!alertData.targetPrice || isNaN(parseFloat(alertData.targetPrice)) || parseFloat(alertData.targetPrice) <= 0) {
        errors.push('Valid target price is required');
    }

    if (!alertData.alertType || ![ALERT_TYPE.ABOVE, ALERT_TYPE.BELOW].includes(alertData.alertType)) {
        errors.push('Alert type must be "above" or "below"');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

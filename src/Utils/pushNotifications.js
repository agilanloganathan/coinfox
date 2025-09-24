import { isUserSignedIn, putFile, getFile } from 'blockstack';

class PushNotificationService {
    constructor() {
        this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
        this.permission = this.isSupported ? Notification.permission : 'denied';
        this.subscription = null;
    }

    // Request notification permission
    async requestPermission() {
        if (!this.isSupported) {
            throw new Error('Push notifications are not supported in this browser');
        }

        if (this.permission === 'default') {
            this.permission = await Notification.requestPermission();
        }

        return this.permission === 'granted';
    }

    // Register service worker for push notifications
    async registerServiceWorker() {
        if (!this.isSupported) return false;

        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }

    // Subscribe to push notifications
    async subscribeToPush() {
        if (!this.isSupported || this.permission !== 'granted') {
            return false;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    'BEl62iUYgUivxIkv69yViEuiBIa40HI8pWXKzJwjfBM22Lnyi0M8T1n1SJ1Ww0S8HF4VEXNBSoyk_hyi4i1iU'
                )
            });

            this.subscription = subscription;
            await this.saveSubscription(subscription);
            return subscription;
        } catch (error) {
            console.error('Push subscription failed:', error);
            return false;
        }
    }

    // Convert VAPID key
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Save subscription to Blockstack storage
    async saveSubscription(subscription) {
        if (!isUserSignedIn()) return;

        try {
            const subscriptionData = {
                subscription: subscription.toJSON(),
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            };

            await putFile('push-subscription.json', JSON.stringify(subscriptionData), {
                encrypt: true
            });
        } catch (error) {
            console.error('Failed to save push subscription:', error);
        }
    }

    // Load subscription from Blockstack storage
    async loadSubscription() {
        if (!isUserSignedIn()) return null;

        try {
            const subscriptionData = await getFile('push-subscription.json', {
                decrypt: true
            });

            if (subscriptionData) {
                const data = JSON.parse(subscriptionData);
                this.subscription = data.subscription;
                return data.subscription;
            }
        } catch (error) {
            console.error('Failed to load push subscription:', error);
        }

        return null;
    }

    // Send push notification
    async sendNotification(title, options = {}) {
        if (!this.isSupported || this.permission !== 'granted') {
            return false;
        }

        const defaultOptions = {
            body: '',
            icon: '/favicon.ico',
            badge: '/mobile-icon.png',
            tag: 'coinfox-alert',
            requireInteraction: true,
            actions: [
                {
                    action: 'view',
                    title: 'View Portfolio',
                    icon: '/favicon.ico'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/favicon.ico'
                }
            ]
        };

        const notificationOptions = { ...defaultOptions, ...options };

        try {
            const notification = new Notification(title, notificationOptions);

            notification.onclick = (event) => {
                event.preventDefault();
                window.focus();
                notification.close();
            };

            return notification;
        } catch (error) {
            console.error('Failed to send notification:', error);
            return false;
        }
    }

    // Send alert notification
    async sendAlertNotification(alert) {
        const title = `🚨 ${alert.coinSymbol} Alert Triggered!`;
        const body = `${alert.coinSymbol} price is now $${alert.currentPrice.toFixed(2)}, ${alert.alertType} your alert of $${alert.targetPrice.toFixed(2)}`;

        return await this.sendNotification(title, {
            body,
            data: {
                alertId: alert.id,
                coinSymbol: alert.coinSymbol,
                currentPrice: alert.currentPrice,
                targetPrice: alert.targetPrice
            }
        });
    }

    // Initialize push notifications
    async initialize() {
        if (!this.isSupported) {
            console.log('Push notifications not supported');
            return false;
        }

        try {
            // Register service worker
            await this.registerServiceWorker();

            // Load existing subscription
            await this.loadSubscription();

            // Request permission if needed
            const hasPermission = await this.requestPermission();

            if (hasPermission && !this.subscription) {
                await this.subscribeToPush();
            }

            return hasPermission;
        } catch (error) {
            console.error('Failed to initialize push notifications:', error);
            return false;
        }
    }

    // Check if notifications are enabled
    isEnabled() {
        return this.isSupported && this.permission === 'granted' && this.subscription !== null;
    }

    // Unsubscribe from push notifications
    async unsubscribe() {
        if (this.subscription) {
            try {
                await this.subscription.unsubscribe();
                this.subscription = null;

                if (isUserSignedIn()) {
                    await putFile('push-subscription.json', '', { encrypt: true });
                }
            } catch (error) {
                console.error('Failed to unsubscribe from push notifications:', error);
            }
        }
    }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;

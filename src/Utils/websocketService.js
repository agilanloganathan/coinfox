// WebSocket Service for Real-time Price Updates
class WebSocketService {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.isConnected = false;
        this.subscribers = new Map();
        this.priceCache = new Map();
        this.alertCallbacks = [];
    }

    // Connect to WebSocket
    connect(url = 'wss://stream.binance.com:9443/ws/') {
        try {
            this.ws = new WebSocket(url);
            this.setupEventHandlers();
        } catch (error) {
            console.error('WebSocket connection failed:', error);
            this.handleReconnect();
        }
    }

    // Setup WebSocket event handlers
    setupEventHandlers() {
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.notifySubscribers('connected', {});
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
            this.notifySubscribers('disconnected', {});
            this.handleReconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.notifySubscribers('error', { error });
        };
    }

    // Handle incoming messages
    handleMessage(data) {
        if (data.stream && data.data) {
            const stream = data.stream;
            const priceData = data.data;

            // Extract symbol from stream name (e.g., "btcusdt@ticker" -> "BTCUSDT")
            const symbol = stream.split('@')[0].toUpperCase();

            // Update price cache
            const previousPrice = this.priceCache.get(symbol);
            this.priceCache.set(symbol, {
                symbol,
                price: parseFloat(priceData.c || priceData.p),
                change24h: parseFloat(priceData.P || 0),
                volume24h: parseFloat(priceData.v || 0),
                timestamp: Date.now()
            });

            // Notify subscribers
            this.notifySubscribers('priceUpdate', {
                symbol,
                currentPrice: parseFloat(priceData.c || priceData.p),
                previousPrice,
                change24h: parseFloat(priceData.P || 0),
                volume24h: parseFloat(priceData.v || 0)
            });

            // Check for triggered alerts
            this.checkAlerts(symbol, parseFloat(priceData.c || priceData.p), previousPrice);
        }
    }

    // Subscribe to price updates for a symbol
    subscribe(symbol, callback) {
        const normalizedSymbol = symbol.toLowerCase();
        const streamName = `${normalizedSymbol}@ticker`;

        if (!this.subscribers.has(streamName)) {
            this.subscribers.set(streamName, new Set());
        }

        this.subscribers.get(streamName).add(callback);

        // Subscribe to WebSocket stream
        if (this.isConnected) {
            this.subscribeToStream(streamName);
        }

        return () => this.unsubscribe(symbol, callback);
    }

    // Unsubscribe from price updates
    unsubscribe(symbol, callback) {
        const normalizedSymbol = symbol.toLowerCase();
        const streamName = `${normalizedSymbol}@ticker`;

        if (this.subscribers.has(streamName)) {
            this.subscribers.get(streamName).delete(callback);

            if (this.subscribers.get(streamName).size === 0) {
                this.subscribers.delete(streamName);
                this.unsubscribeFromStream(streamName);
            }
        }
    }

    // Subscribe to WebSocket stream
    subscribeToStream(streamName) {
        if (this.isConnected && this.ws) {
            const subscribeMessage = {
                method: 'SUBSCRIBE',
                params: [streamName],
                id: Date.now()
            };
            this.ws.send(JSON.stringify(subscribeMessage));
        }
    }

    // Unsubscribe from WebSocket stream
    unsubscribeFromStream(streamName) {
        if (this.isConnected && this.ws) {
            const unsubscribeMessage = {
                method: 'UNSUBSCRIBE',
                params: [streamName],
                id: Date.now()
            };
            this.ws.send(JSON.stringify(unsubscribeMessage));
        }
    }

    // Notify all subscribers
    notifySubscribers(event, data) {
        this.subscribers.forEach((callbacks, streamName) => {
            callbacks.forEach(callback => {
                try {
                    callback(event, data);
                } catch (error) {
                    console.error('Error in subscriber callback:', error);
                }
            });
        });
    }

    // Add alert callback
    addAlertCallback(callback) {
        this.alertCallbacks.push(callback);
    }

    // Remove alert callback
    removeAlertCallback(callback) {
        const index = this.alertCallbacks.indexOf(callback);
        if (index > -1) {
            this.alertCallbacks.splice(index, 1);
        }
    }

    // Check for triggered alerts
    async checkAlerts(symbol, currentPrice, previousPrice) {
        try {
            // Import alert helpers dynamically to avoid circular dependencies
            const { checkAlerts } = await import('./alertHelpers');
            const triggeredAlerts = await checkAlerts(symbol, currentPrice);

            if (triggeredAlerts.length > 0) {
                // Add previous price to alerts for direction calculation
                const alertsWithPreviousPrice = triggeredAlerts.map(alert => ({
                    ...alert,
                    currentPrice,
                    previousPrice
                }));

                // Notify alert callbacks
                this.alertCallbacks.forEach(callback => {
                    try {
                        callback(alertsWithPreviousPrice);
                    } catch (error) {
                        console.error('Error in alert callback:', error);
                    }
                });
            }
        } catch (error) {
            console.error('Error checking alerts:', error);
        }
    }

    // Handle reconnection
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    // Disconnect WebSocket
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }

    // Get current price for a symbol
    getCurrentPrice(symbol) {
        return this.priceCache.get(symbol.toUpperCase());
    }

    // Get connection status
    getStatus() {
        return {
            connected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            subscribers: this.subscribers.size
        };
    }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;

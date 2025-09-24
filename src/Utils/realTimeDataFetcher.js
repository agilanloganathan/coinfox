// Real-time Data Fetcher for Dynamic Notifications
class RealTimeDataFetcher {
    constructor() {
        this.isRunning = false;
        this.updateInterval = 5000; // 5 seconds
        this.marketData = new Map();
        this.subscribers = new Set();
        this.apiEndpoints = {
            coinGecko: 'https://api.coingecko.com/api/v3/simple/price',
            cryptoCompare: 'https://min-api.cryptocompare.com/data/pricemulti',
            binance: 'https://api.binance.com/api/v3/ticker/24hr'
        };
    }

    // Start real-time data fetching
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        console.log('Starting real-time data fetcher...');

        // Initial fetch
        this.fetchAllData();

        // Set up interval
        this.interval = setInterval(() => {
            this.fetchAllData();
        }, this.updateInterval);
    }

    // Stop real-time data fetching
    stop() {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        console.log('Stopped real-time data fetcher');
    }

    // Fetch all market data
    async fetchAllData() {
        try {
            await Promise.all([
                this.fetchCoinGeckoData(),
                this.fetchBinanceData(),
                this.fetchCryptoCompareData()
            ]);

            // Notify subscribers
            this.notifySubscribers();
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    }

    // Fetch data from CoinGecko
    async fetchCoinGeckoData() {
        try {
            const symbols = ['bitcoin', 'ethereum', 'cardano', 'polkadot', 'chainlink', 'litecoin', 'bitcoin-cash', 'ripple', 'eos', 'tron'];
            const response = await fetch(`${this.apiEndpoints.coinGecko}?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`);

            if (response.ok) {
                const data = await response.json();

                Object.entries(data).forEach(([coinId, coinData]) => {
                    const symbol = this.getSymbolFromCoinGeckoId(coinId);
                    this.updateMarketData(symbol, {
                        price: coinData.usd,
                        change24h: coinData.usd_24h_change,
                        marketCap: coinData.usd_market_cap,
                        volume24h: coinData.usd_24h_vol,
                        source: 'coingecko',
                        timestamp: Date.now()
                    });
                });
            }
        } catch (error) {
            console.error('Error fetching CoinGecko data:', error);
        }
    }

    // Fetch data from Binance
    async fetchBinanceData() {
        try {
            const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'LTCUSDT', 'BCHUSDT', 'XRPUSDT', 'EOSUSDT', 'TRXUSDT'];
            const symbolsParam = symbols.map(symbol => `"${symbol}"`).join(',');
            const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbolsParam}]`;

            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();

                data.forEach(ticker => {
                    const symbol = ticker.symbol.replace('USDT', '').toLowerCase();
                    this.updateMarketData(symbol, {
                        price: parseFloat(ticker.lastPrice),
                        change24h: parseFloat(ticker.priceChangePercent),
                        volume24h: parseFloat(ticker.volume),
                        high24h: parseFloat(ticker.highPrice),
                        low24h: parseFloat(ticker.lowPrice),
                        openPrice: parseFloat(ticker.openPrice),
                        closePrice: parseFloat(ticker.prevClosePrice),
                        weightedAvgPrice: parseFloat(ticker.weightedAvgPrice),
                        priceChange: parseFloat(ticker.priceChange),
                        quoteVolume: parseFloat(ticker.quoteVolume),
                        count: ticker.count,
                        openTime: ticker.openTime,
                        closeTime: ticker.closeTime,
                        bidPrice: parseFloat(ticker.bidPrice),
                        askPrice: parseFloat(ticker.askPrice),
                        bidQty: parseFloat(ticker.bidQty),
                        askQty: parseFloat(ticker.askQty),
                        lastQty: parseFloat(ticker.lastQty),
                        source: 'binance',
                        timestamp: Date.now()
                    });
                });
            }
        } catch (error) {
            console.error('Error fetching Binance data:', error);
        }
    }

    // Fetch data from CryptoCompare
    async fetchCryptoCompareData() {
        try {
            const symbols = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'LTC', 'BCH', 'XRP', 'EOS', 'TRX'];
            const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join(',')}&tsyms=USD&e=CCCAGG`;

            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();

                Object.entries(data).forEach(([symbol, priceData]) => {
                    this.updateMarketData(symbol.toLowerCase(), {
                        price: priceData.USD,
                        source: 'cryptocompare',
                        timestamp: Date.now(),
                        exchange: 'CCCAGG'
                    });
                });

                console.log('CryptoCompare data fetched:', data);
            }
        } catch (error) {
            console.error('Error fetching CryptoCompare data:', error);
        }
    }

    // Update market data for a symbol
    updateMarketData(symbol, data) {
        const existing = this.marketData.get(symbol) || {};
        const updated = {
            ...existing,
            ...data,
            lastUpdated: Date.now()
        };

        this.marketData.set(symbol, updated);
    }

    // Get symbol from CoinGecko ID
    getSymbolFromCoinGeckoId(coinId) {
        const idMap = {
            'bitcoin': 'BTC',
            'ethereum': 'ETH',
            'cardano': 'ADA',
            'polkadot': 'DOT',
            'chainlink': 'LINK',
            'litecoin': 'LTC',
            'bitcoin-cash': 'BCH',
            'ripple': 'XRP',
            'eos': 'EOS',
            'tron': 'TRX'
        };
        return idMap[coinId] || coinId.toUpperCase();
    }

    // Subscribe to data updates
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    // Notify all subscribers
    notifySubscribers() {
        const data = {
            marketData: Object.fromEntries(this.marketData),
            timestamp: Date.now(),
            totalSymbols: this.marketData.size
        };

        this.subscribers.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in subscriber callback:', error);
            }
        });
    }

    // Get market data for a specific symbol
    getMarketData(symbol) {
        return this.marketData.get(symbol.toUpperCase());
    }

    // Get all market data
    getAllMarketData() {
        return Object.fromEntries(this.marketData);
    }

    // Get price for a symbol
    getPrice(symbol) {
        const data = this.marketData.get(symbol.toUpperCase());
        return data?.price || 0;
    }

    // Get 24h change for a symbol
    getChange24h(symbol) {
        const data = this.marketData.get(symbol.toUpperCase());
        return data?.change24h || 0;
    }

    // Get volume for a symbol
    getVolume24h(symbol) {
        const data = this.marketData.get(symbol.toUpperCase());
        return data?.volume24h || 0;
    }

    // Get market cap for a symbol
    getMarketCap(symbol) {
        const data = this.marketData.get(symbol.toUpperCase());
        return data?.marketCap || 0;
    }

    // Check if data is fresh (less than 10 seconds old)
    isDataFresh(symbol) {
        const data = this.marketData.get(symbol.toUpperCase());
        if (!data) return false;

        const age = Date.now() - data.lastUpdated;
        return age < 10000; // 10 seconds
    }

    // Get data age in seconds
    getDataAge(symbol) {
        const data = this.marketData.get(symbol.toUpperCase());
        if (!data) return null;

        return Math.floor((Date.now() - data.lastUpdated) / 1000);
    }

    // Get status
    getStatus() {
        return {
            running: this.isRunning,
            updateInterval: this.updateInterval,
            totalSymbols: this.marketData.size,
            subscribers: this.subscribers.size,
            lastUpdate: this.marketData.size > 0 ? Math.max(...Array.from(this.marketData.values()).map(d => d.lastUpdated)) : null
        };
    }
}

// Create singleton instance
const realTimeDataFetcher = new RealTimeDataFetcher();

export default realTimeDataFetcher;

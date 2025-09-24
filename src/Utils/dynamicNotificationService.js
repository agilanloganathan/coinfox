// Enhanced Dynamic Notification Service
class DynamicNotificationService {
    constructor() {
        this.isSupported = 'Notification' in window;
        this.permission = this.isSupported ? Notification.permission : 'denied';
        this.marketData = new Map();
        this.portfolioData = null;
    }

    // Update market data for dynamic notifications
    updateMarketData(marketData) {
        this.marketData = new Map(Object.entries(marketData));
    }

    // Update portfolio data
    updatePortfolioData(portfolioData) {
        this.portfolioData = portfolioData;
    }

    // Send dynamic price alert notification
    async sendDynamicPriceAlert(alert) {
        if (!this.isSupported || this.permission !== 'granted') {
            return false;
        }

        try {
            const dynamicData = await this.gatherDynamicData(alert);
            const notification = new Notification('🚨 Dynamic Price Alert', {
                body: this.formatDynamicBody(alert, dynamicData),
                icon: '/mobile-icon.png',
                badge: '/mobile-icon.png',
                tag: `dynamic-alert-${alert.id}`,
                requireInteraction: true,
                silent: false,
                data: {
                    ...dynamicData,
                    alertId: alert.id,
                    timestamp: Date.now(),
                    type: 'price_alert'
                }
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
                this.handleNotificationClick(dynamicData);
            };

            setTimeout(() => notification.close(), 15000);
            return true;
        } catch (error) {
            console.error('Error sending dynamic notification:', error);
            return false;
        }
    }

    // Gather dynamic data for notifications
    async gatherDynamicData(alert) {
        const coinSymbol = alert.coinSymbol;
        const currentPrice = alert.currentPrice;
        const previousPrice = alert.previousPrice;

        // Calculate price change
        const priceChange = currentPrice - (previousPrice || currentPrice);
        const priceChangePercent = previousPrice ? ((priceChange / previousPrice) * 100) : 0;

        // Get market data
        const marketInfo = this.marketData.get(coinSymbol.toLowerCase());

        // Get portfolio impact
        const portfolioImpact = this.calculatePortfolioImpact(alert);

        // Get market sentiment
        const marketSentiment = this.getMarketSentiment(priceChangePercent);

        // Get volume data
        const volumeData = this.getVolumeData(marketInfo);

        // Get technical indicators
        const technicalData = this.getTechnicalIndicators(alert, marketInfo);

        return {
            coinSymbol,
            currentPrice,
            previousPrice,
            priceChange,
            priceChangePercent,
            marketSentiment,
            portfolioImpact,
            volumeData,
            technicalData,
            marketCap: marketInfo?.market_cap || 0,
            rank: marketInfo?.market_cap_rank || 0,
            ath: marketInfo?.ath || 0,
            atl: marketInfo?.atl || 0,
            athChange: marketInfo?.ath_change_percentage || 0,
            atlChange: marketInfo?.atl_change_percentage || 0
        };
    }

    // Format dynamic notification body
    formatDynamicBody(alert, dynamicData) {
        const {
            coinSymbol,
            currentPrice,
            priceChangePercent,
            marketSentiment,
            portfolioImpact,
            volumeData,
            technicalData,
            rank,
            athChange
        } = dynamicData;

        let body = `💰 ${coinSymbol}: $${currentPrice.toFixed(2)}\n`;

        // Price change
        const changeIcon = priceChangePercent >= 0 ? '📈' : '📉';
        body += `${changeIcon} ${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%\n`;

        // Market sentiment
        body += `🎯 ${marketSentiment}\n`;

        // Portfolio impact
        if (portfolioImpact.impact > 0) {
            body += `💼 Portfolio: ${portfolioImpact.impact >= 0 ? '+' : ''}$${portfolioImpact.impact.toFixed(2)}\n`;
        }

        // Volume
        if (volumeData.volumeChange > 0) {
            body += `📊 Volume: ${volumeData.volumeChange >= 0 ? '+' : ''}${volumeData.volumeChange.toFixed(1)}%\n`;
        }

        // Technical indicators
        if (technicalData.rsi) {
            body += `⚡ RSI: ${technicalData.rsi.toFixed(1)} ${technicalData.rsiSignal}\n`;
        }

        // Market rank
        if (rank > 0) {
            body += `🏆 Rank: #${rank}`;
        }

        return body;
    }

    // Calculate portfolio impact
    calculatePortfolioImpact(alert) {
        if (!this.portfolioData) {
            return { impact: 0, percentage: 0 };
        }

        // This would calculate how the price change affects the user's portfolio
        // For now, return a mock calculation
        const holdings = this.portfolioData.coinz?.[alert.coinSymbol.toLowerCase()]?.hodl || 0;
        const priceChange = alert.currentPrice - (alert.previousPrice || alert.currentPrice);
        const impact = holdings * priceChange;
        const totalValue = this.portfolioData.totalValue || 1;
        const percentage = (impact / totalValue) * 100;

        return { impact, percentage };
    }

    // Get market sentiment
    getMarketSentiment(priceChangePercent) {
        if (priceChangePercent > 10) return '🚀 Bullish Surge';
        if (priceChangePercent > 5) return '📈 Strong Bullish';
        if (priceChangePercent > 2) return '⬆️ Bullish';
        if (priceChangePercent > 0) return '↗️ Slightly Bullish';
        if (priceChangePercent > -2) return '↘️ Slightly Bearish';
        if (priceChangePercent > -5) return '⬇️ Bearish';
        if (priceChangePercent > -10) return '📉 Strong Bearish';
        return '🐻 Bearish Crash';
    }

    // Get volume data
    getVolumeData(marketInfo) {
        if (!marketInfo) {
            return { volume: 0, volumeChange: 0 };
        }

        const volume24h = marketInfo.total_volume || 0;
        const volumeChange = marketInfo.price_change_percentage_24h || 0;

        return {
            volume: volume24h,
            volumeChange: volumeChange
        };
    }

    // Get technical indicators
    getTechnicalIndicators(alert, marketInfo) {
        if (!marketInfo) {
            return { rsi: null, rsiSignal: '', macd: null };
        }

        // Mock RSI calculation (in real app, you'd use a proper technical analysis library)
        const priceChange24h = marketInfo.price_change_percentage_24h || 0;
        const rsi = 50 + (priceChange24h * 2); // Simplified RSI
        const rsiSignal = rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral';

        return {
            rsi: Math.max(0, Math.min(100, rsi)),
            rsiSignal,
            macd: null // Would calculate MACD in real implementation
        };
    }

    // Send dynamic portfolio notification
    async sendDynamicPortfolioNotification() {
        if (!this.portfolioData || !this.isSupported || this.permission !== 'granted') {
            return false;
        }

        try {
            const dynamicData = this.gatherPortfolioDynamicData();
            const notification = new Notification('📊 Dynamic Portfolio Update', {
                body: this.formatPortfolioBody(dynamicData),
                icon: '/mobile-icon.png',
                tag: 'dynamic-portfolio',
                requireInteraction: false,
                silent: false,
                data: {
                    ...dynamicData,
                    timestamp: Date.now(),
                    type: 'portfolio_update'
                }
            });

            setTimeout(() => notification.close(), 12000);
            return true;
        } catch (error) {
            console.error('Error sending portfolio notification:', error);
            return false;
        }
    }

    // Gather portfolio dynamic data
    gatherPortfolioDynamicData() {
        const { totalValue, totalGainLoss, gainLossPercent, coinz } = this.portfolioData;

        // Find best and worst performers
        const performers = Object.entries(coinz).map(([symbol, data]) => {
            const marketData = this.marketData.get(symbol);
            const change24h = marketData?.price_change_percentage_24h || 0;
            return { symbol: symbol.toUpperCase(), change: change24h };
        }).sort((a, b) => b.change - a.change);

        const bestPerformer = performers[0];
        const worstPerformer = performers[performers.length - 1];

        return {
            totalValue,
            totalGainLoss,
            gainLossPercent,
            bestPerformer,
            worstPerformer,
            totalCoins: performers.length,
            diversification: this.calculateDiversification(coinz)
        };
    }

    // Format portfolio notification body
    formatPortfolioBody(data) {
        const { totalValue, totalGainLoss, gainLossPercent, bestPerformer, worstPerformer, diversification } = data;

        let body = `💰 Total: $${totalValue.toFixed(2)}\n`;
        body += `${totalGainLoss >= 0 ? '📈' : '📉'} ${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toFixed(2)} (${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(2)}%)\n`;

        if (bestPerformer) {
            body += `🏆 Best: ${bestPerformer.symbol} ${bestPerformer.change >= 0 ? '+' : ''}${bestPerformer.change.toFixed(1)}%\n`;
        }

        if (worstPerformer && worstPerformer.symbol !== bestPerformer?.symbol) {
            body += `📉 Worst: ${worstPerformer.symbol} ${worstPerformer.change >= 0 ? '+' : ''}${worstPerformer.change.toFixed(1)}%\n`;
        }

        body += `🎯 Diversification: ${diversification}%`;

        return body;
    }

    // Calculate portfolio diversification
    calculateDiversification(coinz) {
        const holdings = Object.values(coinz);
        const totalValue = holdings.reduce((sum, coin) => sum + (coin.hodl * coin.price || 0), 0);

        if (totalValue === 0) return 0;

        // Calculate Herfindahl index for diversification
        const weights = holdings.map(coin => {
            const value = coin.hodl * coin.price || 0;
            return (value / totalValue) ** 2;
        });

        const herfindahlIndex = weights.reduce((sum, weight) => sum + weight, 0);
        return Math.round((1 - herfindahlIndex) * 100);
    }

    // Handle notification click
    handleNotificationClick(data) {
        console.log('Dynamic notification clicked:', data);

        // You can add navigation logic here
        if (data.type === 'price_alert') {
            // Navigate to coin detail page
            window.location.href = `/coin/${data.coinSymbol.toLowerCase()}`;
        } else if (data.type === 'portfolio_update') {
            // Navigate to portfolio/analytics page
            window.location.href = '/analytics';
        }
    }

    // Request permission
    async requestPermission() {
        if (!this.isSupported) return false;

        if (this.permission === 'granted') return true;

        try {
            this.permission = await Notification.requestPermission();
            return this.permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    // Get status
    getStatus() {
        return {
            supported: this.isSupported,
            permission: this.permission,
            enabled: this.isSupported && this.permission === 'granted'
        };
    }
}

// Create singleton instance
const dynamicNotificationService = new DynamicNotificationService();

export default dynamicNotificationService;

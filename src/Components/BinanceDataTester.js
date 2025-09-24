import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 20px;
  background: #2a2a2a;
  border-radius: 8px;
  margin: 20px;
`;

const TestButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #0056b3;
  }
`;

const TestTitle = styled.h3`
  color: #fff;
  margin-bottom: 15px;
`;

const DataDisplay = styled.div`
  background: #1a1a1a;
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
  font-family: monospace;
  font-size: 12px;
  color: #ccc;
  max-height: 300px;
  overflow-y: auto;
`;

const BinanceDataTester = () => {
    const [binanceData, setBinanceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBinanceData = async () => {
        setLoading(true);
        setError(null);

        try {
            const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'LTCUSDT', 'BCHUSDT', 'XRPUSDT', 'EOSUSDT', 'TRXUSDT'];
            const symbolsParam = symbols.map(symbol => `"${symbol}"`).join(',');
            const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbolsParam}]`;

            console.log('Fetching from URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setBinanceData(data);
            console.log('Binance data received:', data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching Binance data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
    };

    const formatVolume = (volume) => {
        return parseFloat(volume).toLocaleString();
    };

    const formatChange = (change) => {
        const value = parseFloat(change);
        return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
    };

    return (
        <TestContainer>
            <TestTitle>🔗 Binance API Data Tester</TestTitle>
            <p style={{ color: '#ccc', marginBottom: '15px' }}>
                Test the Binance API integration with real-time cryptocurrency data:
            </p>

            <div>
                <TestButton onClick={fetchBinanceData} disabled={loading}>
                    {loading ? '🔄 Fetching...' : '📊 Fetch Binance Data'}
                </TestButton>
            </div>

            {error && (
                <DataDisplay style={{ color: '#ff4757', border: '1px solid #ff4757' }}>
                    ❌ Error: {error}
                </DataDisplay>
            )}

            {binanceData && (
                <DataDisplay>
                    <div style={{ color: '#21ce99', marginBottom: '10px' }}>
                        ✅ Successfully fetched {binanceData.length} symbols from Binance API
                    </div>

                    {binanceData.map((ticker, index) => (
                        <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
                            <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>
                                {ticker.symbol.replace('USDT', '')} - ${formatPrice(ticker.lastPrice)}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
                                <div>
                                    <span style={{ color: '#888' }}>24h Change: </span>
                                    <span style={{ color: parseFloat(ticker.priceChangePercent) >= 0 ? '#21ce99' : '#ff4757' }}>
                                        {formatChange(ticker.priceChangePercent)}
                                    </span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Volume: </span>
                                    <span style={{ color: '#fff' }}>{formatVolume(ticker.volume)}</span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>High: </span>
                                    <span style={{ color: '#fff' }}>${formatPrice(ticker.highPrice)}</span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Low: </span>
                                    <span style={{ color: '#fff' }}>${formatPrice(ticker.lowPrice)}</span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Open: </span>
                                    <span style={{ color: '#fff' }}>${formatPrice(ticker.openPrice)}</span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Close: </span>
                                    <span style={{ color: '#fff' }}>${formatPrice(ticker.prevClosePrice)}</span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Weighted Avg: </span>
                                    <span style={{ color: '#fff' }}>${formatPrice(ticker.weightedAvgPrice)}</span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Trades: </span>
                                    <span style={{ color: '#fff' }}>{ticker.count.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </DataDisplay>
            )}

            <p style={{ color: '#888', fontSize: '12px', marginTop: '15px' }}>
                This data is now integrated into your CoinFox application for enhanced market data and alerts!
            </p>
        </TestContainer>
    );
};

export default BinanceDataTester;



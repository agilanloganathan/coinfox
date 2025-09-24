import React, { useState } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 20px;
  background: #2a2a2a;
  border-radius: 8px;
  margin: 20px;
`;

const TestButton = styled.button`
  background: linear-gradient(45deg, #007bff, #28a745, #ffc107);
  color: white;
  border: none;
  padding: 12px 24px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  
  &:hover {
    opacity: 0.9;
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
  max-height: 400px;
  overflow-y: auto;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin: 10px 0;
`;

const APIDataTester = () => {
    const [allData, setAllData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllAPIData = async () => {
        setLoading(true);
        setError(null);

        try {
            const symbols = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'LTC', 'BCH', 'XRP', 'EOS', 'TRX'];

            // Fetch from all three APIs simultaneously
            const [binanceResponse, cryptocompareResponse, coingeckoResponse] = await Promise.allSettled([
                // Binance API
                fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols.map(s => `"${s}USDT"`).join(',')}]`),

                // CryptoCompare API
                fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join(',')}&tsyms=USD&e=CCCAGG`),

                // CoinGecko API
                fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,polkadot,chainlink,litecoin,bitcoin-cash,ripple,eos,tron&vs_currencies=usd&include_24hr_change=true`)
            ]);

            const results = {
                binance: null,
                cryptocompare: null,
                coingecko: null,
                comparison: {}
            };

            // Process Binance data
            if (binanceResponse.status === 'fulfilled' && binanceResponse.value.ok) {
                const binanceData = await binanceResponse.value.json();
                results.binance = binanceData;

                binanceData.forEach(ticker => {
                    const symbol = ticker.symbol.replace('USDT', '').toLowerCase();
                    if (!results.comparison[symbol]) {
                        results.comparison[symbol] = {};
                    }
                    results.comparison[symbol].binance = {
                        price: parseFloat(ticker.lastPrice),
                        change: parseFloat(ticker.priceChangePercent),
                        volume: parseFloat(ticker.volume),
                        high: parseFloat(ticker.highPrice),
                        low: parseFloat(ticker.lowPrice)
                    };
                });
            }

            // Process CryptoCompare data
            if (cryptocompareResponse.status === 'fulfilled' && cryptocompareResponse.value.ok) {
                const cryptocompareData = await cryptocompareResponse.value.json();
                results.cryptocompare = cryptocompareData;

                Object.entries(cryptocompareData).forEach(([symbol, priceData]) => {
                    const symbolLower = symbol.toLowerCase();
                    if (!results.comparison[symbolLower]) {
                        results.comparison[symbolLower] = {};
                    }
                    results.comparison[symbolLower].cryptocompare = {
                        price: priceData.USD
                    };
                });
            }

            // Process CoinGecko data
            if (coingeckoResponse.status === 'fulfilled' && coingeckoResponse.value.ok) {
                const coingeckoData = await coingeckoResponse.value.json();
                results.coingecko = coingeckoData;

                const coinMapping = {
                    'bitcoin': 'btc',
                    'ethereum': 'eth',
                    'cardano': 'ada',
                    'polkadot': 'dot',
                    'chainlink': 'link',
                    'litecoin': 'ltc',
                    'bitcoin-cash': 'bch',
                    'ripple': 'xrp',
                    'eos': 'eos',
                    'tron': 'trx'
                };

                Object.entries(coingeckoData).forEach(([coinId, coinData]) => {
                    const symbol = coinMapping[coinId];
                    if (symbol && !results.comparison[symbol]) {
                        results.comparison[symbol] = {};
                    }
                    if (symbol) {
                        results.comparison[symbol].coingecko = {
                            price: coinData.usd,
                            change: coinData.usd_24h_change
                        };
                    }
                });
            }

            setAllData(results);
            console.log('All API data received:', results);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching API data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        const num = parseFloat(price);
        if (num >= 1000) {
            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return num.toFixed(4);
    };

    const formatChange = (change) => {
        if (change === undefined || change === null) return 'N/A';
        const value = parseFloat(change);
        return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
    };

    return (
        <TestContainer>
            <TestTitle>🚀 Multi-API Data Source Comparison</TestTitle>
            <p style={{ color: '#ccc', marginBottom: '15px' }}>
                Test all three API integrations simultaneously and compare data sources:
            </p>

            <div>
                <TestButton onClick={fetchAllAPIData} disabled={loading}>
                    {loading ? '🔄 Fetching All APIs...' : '📊 Fetch All API Data'}
                </TestButton>
            </div>

            {error && (
                <DataDisplay style={{ color: '#ff4757', border: '1px solid #ff4757' }}>
                    ❌ Error: {error}
                </DataDisplay>
            )}

            {allData && (
                <DataDisplay>
                    <div style={{ color: '#21ce99', marginBottom: '15px', fontSize: '14px' }}>
                        ✅ Successfully fetched data from multiple APIs
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
                            📈 API Data Sources:
                        </div>
                        <ComparisonGrid>
                            <div style={{ padding: '10px', backgroundColor: '#007bff20', borderRadius: '4px', border: '1px solid #007bff' }}>
                                <div style={{ color: '#007bff', fontWeight: 'bold' }}>🔗 Binance</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>Real-time trading data</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>Status: {allData.binance ? '✅ Connected' : '❌ Failed'}</div>
                            </div>

                            <div style={{ padding: '10px', backgroundColor: '#28a74520', borderRadius: '4px', border: '1px solid #28a745' }}>
                                <div style={{ color: '#28a745', fontWeight: 'bold' }}>📊 CryptoCompare</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>Aggregated exchange data</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>Status: {allData.cryptocompare ? '✅ Connected' : '❌ Failed'}</div>
                            </div>

                            <div style={{ padding: '10px', backgroundColor: '#ffc10720', borderRadius: '4px', border: '1px solid #ffc107' }}>
                                <div style={{ color: '#ffc107', fontWeight: 'bold' }}>🦎 CoinGecko</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>Comprehensive market data</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>Status: {allData.coingecko ? '✅ Connected' : '❌ Failed'}</div>
                            </div>
                        </ComparisonGrid>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
                            💰 Price Comparison by Symbol:
                        </div>

                        {Object.entries(allData.comparison).map(([symbol, sources]) => (
                            <div key={symbol} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
                                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                                    {symbol.toUpperCase()}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                                    {sources.binance && (
                                        <div style={{ padding: '8px', backgroundColor: '#007bff20', borderRadius: '4px', border: '1px solid #007bff' }}>
                                            <div style={{ color: '#007bff', fontWeight: 'bold', fontSize: '11px' }}>Binance</div>
                                            <div style={{ color: '#fff' }}>${formatPrice(sources.binance.price)}</div>
                                            <div style={{ color: sources.binance.change >= 0 ? '#21ce99' : '#ff4757', fontSize: '10px' }}>
                                                {formatChange(sources.binance.change)}
                                            </div>
                                        </div>
                                    )}

                                    {sources.cryptocompare && (
                                        <div style={{ padding: '8px', backgroundColor: '#28a74520', borderRadius: '4px', border: '1px solid #28a745' }}>
                                            <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '11px' }}>CryptoCompare</div>
                                            <div style={{ color: '#fff' }}>${formatPrice(sources.cryptocompare.price)}</div>
                                            <div style={{ color: '#888', fontSize: '10px' }}>Aggregated</div>
                                        </div>
                                    )}

                                    {sources.coingecko && (
                                        <div style={{ padding: '8px', backgroundColor: '#ffc10720', borderRadius: '4px', border: '1px solid #ffc107' }}>
                                            <div style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '11px' }}>CoinGecko</div>
                                            <div style={{ color: '#fff' }}>${formatPrice(sources.coingecko.price)}</div>
                                            <div style={{ color: sources.coingecko.change >= 0 ? '#21ce99' : '#ff4757', fontSize: '10px' }}>
                                                {formatChange(sources.coingecko.change)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1e3a8a', borderRadius: '4px' }}>
                        <div style={{ color: '#60a5fa', fontSize: '11px' }}>
                            🎯 <strong>Integration Strategy:</strong><br />
                            • Binance: Primary source for supported symbols (real-time trading data)<br />
                            • CryptoCompare: Fallback for unsupported symbols (aggregated pricing)<br />
                            • CoinGecko: Comprehensive coverage for all cryptocurrencies<br />
                            • Automatic failover ensures reliable data availability
                        </div>
                    </div>
                </DataDisplay>
            )}

            <p style={{ color: '#888', fontSize: '12px', marginTop: '15px' }}>
                Your CoinFox application now uses multiple data sources for maximum reliability and coverage!
            </p>
        </TestContainer>
    );
};

export default APIDataTester;



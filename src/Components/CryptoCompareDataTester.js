import React, { useState } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 20px;
  background: #2a2a2a;
  border-radius: 8px;
  margin: 20px;
`;

const TestButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #218838;
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

const CryptoCompareDataTester = () => {
    const [cryptocompareData, setCryptocompareData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCryptoCompareData = async () => {
        setLoading(true);
        setError(null);

        try {
            const symbols = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'LTC', 'BCH', 'XRP', 'EOS', 'TRX'];
            const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join(',')}&tsyms=USD&e=CCCAGG`;

            console.log('Fetching from CryptoCompare URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCryptocompareData(data);
            console.log('CryptoCompare data received:', data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching CryptoCompare data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
    };

    const formatLargePrice = (price) => {
        const num = parseFloat(price);
        if (num >= 1000) {
            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return num.toFixed(4);
    };

    return (
        <TestContainer>
            <TestTitle>📊 CryptoCompare API Data Tester</TestTitle>
            <p style={{ color: '#ccc', marginBottom: '15px' }}>
                Test the CryptoCompare API integration with aggregated cryptocurrency prices:
            </p>

            <div>
                <TestButton onClick={fetchCryptoCompareData} disabled={loading}>
                    {loading ? '🔄 Fetching...' : '📈 Fetch CryptoCompare Data'}
                </TestButton>
            </div>

            {error && (
                <DataDisplay style={{ color: '#ff4757', border: '1px solid #ff4757' }}>
                    ❌ Error: {error}
                </DataDisplay>
            )}

            {cryptocompareData && (
                <DataDisplay>
                    <div style={{ color: '#28a745', marginBottom: '10px' }}>
                        ✅ Successfully fetched {Object.keys(cryptocompareData).length} symbols from CryptoCompare API
                    </div>

                    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#333', borderRadius: '4px' }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>
                            📊 CCCAGG Exchange Data
                        </div>
                        <div style={{ fontSize: '11px', color: '#888' }}>
                            CryptoCompare aggregates data from multiple exchanges for more accurate pricing
                        </div>
                    </div>

                    {Object.entries(cryptocompareData).map(([symbol, priceData], index) => (
                        <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
                            <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>
                                {symbol} - ${formatLargePrice(priceData.USD)}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
                                <div>
                                    <span style={{ color: '#888' }}>Symbol: </span>
                                    <span style={{ color: '#fff' }}>{symbol}</span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Price (USD): </span>
                                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                                        ${formatLargePrice(priceData.USD)}
                                    </span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Exchange: </span>
                                    <span style={{ color: '#fff' }}>CCCAGG</span>
                                </div>

                                <div>
                                    <span style={{ color: '#888' }}>Source: </span>
                                    <span style={{ color: '#fff' }}>CryptoCompare</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1e3a8a', borderRadius: '4px' }}>
                        <div style={{ color: '#60a5fa', fontSize: '11px' }}>
                            💡 <strong>Integration Benefits:</strong><br />
                            • Aggregated pricing from multiple exchanges<br />
                            • More reliable price data<br />
                            • Fallback option for unsupported symbols<br />
                            • Professional-grade market data
                        </div>
                    </div>
                </DataDisplay>
            )}

            <p style={{ color: '#888', fontSize: '12px', marginTop: '15px' }}>
                This data is integrated as a fallback option in your CoinFox application for comprehensive market coverage!
            </p>
        </TestContainer>
    );
};

export default CryptoCompareDataTester;



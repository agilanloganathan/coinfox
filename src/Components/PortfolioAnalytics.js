import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import Highcharts from 'highcharts';
import PropTypes from 'prop-types';

const AnalyticsContainer = styled.div`
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  margin: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const AnalyticsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const AnalyticsTitle = styled.h2`
  color: var(--text-primary);
  margin: 0;
  font-size: 28px;
  font-weight: 700;
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const TimeRangeButton = styled.button`
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  min-height: 44px; /* Touch target minimum */
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-hover)' : 'var(--surface-hover)'};
    border-color: var(--border-hover);
    transform: translateY(-1px);
  }
  
  @media (max-width: 576px) {
    width: 100%;
    text-align: center;
  }
  
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
    }
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const MetricCard = styled.div`
  background: var(--surface-hover);
  border-radius: var(--border-radius-md);
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const MetricValue = styled.div`
  color: ${props => props.positive ? 'var(--success-color)' : props.negative ? 'var(--error-color)' : 'var(--text-primary)'};
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  background: var(--surface-hover);
  border-radius: var(--border-radius-md);
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-sm);
`;

const ChartTitle = styled.h3`
  color: var(--text-primary);
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
`;

const PerformanceTable = styled.div`
  background: #404042;
  border-radius: 8px;
  padding: 20px;
`;

const TableTitle = styled.h3`
  color: white;
  margin: 0 0 16px 0;
  font-size: 18px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  color: #aaa;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  padding: 12px 8px;
  border-bottom: 1px solid #555;
`;

const TableRow = styled.tr`
  &:hover {
    background: #505052;
  }
`;

const TableCell = styled.td`
  color: white;
  font-size: 14px;
  padding: 12px 8px;
  border-bottom: 1px solid #333;
`;

const PerformanceCell = styled.td`
  color: ${props => props.positive ? '#21ce99' : '#d82d2d'};
  font-size: 14px;
  font-weight: 500;
  padding: 12px 8px;
  border-bottom: 1px solid #333;
`;

const DiversificationCard = styled.div`
  background: #404042;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
`;

const DiversificationTitle = styled.h3`
  color: white;
  margin: 0 0 16px 0;
  font-size: 18px;
`;

const DiversificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CoinName = styled.span`
  color: white;
  font-size: 14px;
`;

const Percentage = styled.span`
  color: #21ce99;
  font-size: 14px;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #333;
  border-radius: 4px;
  margin-top: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #21ce99;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const RiskIndicator = styled.div`
  background: #404042;
  border-radius: 8px;
  padding: 20px;
`;

const RiskTitle = styled.h3`
  color: white;
  margin: 0 0 16px 0;
  font-size: 18px;
`;

const RiskLevel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const RiskValue = styled.div`
  color: ${props => {
        if (props.level === 'low') return '#21ce99';
        if (props.level === 'medium') return '#ff6b35';
        return '#d82d2d';
    }};
  font-size: 20px;
  font-weight: 600;
`;

const RiskLabel = styled.div`
  color: #aaa;
  font-size: 14px;
`;

const RiskBar = styled.div`
  width: 100%;
  height: 12px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const RiskBarFill = styled.div`
  height: 100%;
  background: ${props => {
        if (props.level === 'low') return '#21ce99';
        if (props.level === 'medium') return '#ff6b35';
        return '#d82d2d';
    }};
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const PortfolioAnalytics = ({
    coinz = {},
    marketData = {},
    exchangeRate = 1,
    currency = 'USD',
    totalPortfolio = 0
}) => {
    const [timeRange, setTimeRange] = useState('24h');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const initialAnalytics = useMemo(() => ({
        totalValue: 0,
        change24h: 0,
        change7d: 0,
        change30d: 0,
        bestPerformer: null,
        worstPerformer: null,
        diversification: [],
        riskLevel: 'medium',
        riskScore: 0
    }), []);

    const [analytics, setAnalytics] = useState(initialAnalytics);

    // Memoized calculations for better performance
    const calculatedAnalytics = useMemo(() => {
        if (!coinz || !marketData || Object.keys(coinz).length === 0) {
            return initialAnalytics;
        }

        const coins = Object.keys(coinz);
        let totalValue = 0;
        let totalCostBasis = 0;
        const performances = [];
        const diversification = [];

        // Calculate portfolio metrics
        coins.forEach(coinSymbol => {
            const coin = coinz[coinSymbol];
            const coinData = marketData[coinSymbol.toLowerCase()];

            if (!coinData || !coinData.ticker) return;

            const currentPrice = coinData.ticker.price * exchangeRate;
            const coinValue = coin.hodl * currentPrice;
            const coinCostBasis = coin.hodl * coin.cost_basis * exchangeRate;
            const performance = ((currentPrice - coin.cost_basis * exchangeRate) / (coin.cost_basis * exchangeRate)) * 100;

            totalValue += coinValue;
            totalCostBasis += coinCostBasis;

            performances.push({
                coin: coinSymbol,
                performance,
                value: coinValue
            });

            diversification.push({
                coin: coinSymbol,
                percentage: 0, // Will be calculated after totalValue is known
                value: coinValue
            });
        });

        // Calculate diversification percentages
        diversification.forEach(item => {
            item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
        });

        // Sort performances
        performances.sort((a, b) => b.performance - a.performance);

        // Calculate risk score (simplified volatility measure)
        const avgPerformance = performances.reduce((sum, p) => sum + p.performance, 0) / performances.length;
        const variance = performances.reduce((sum, p) => sum + Math.pow(p.performance - avgPerformance, 2), 0) / performances.length;
        const riskScore = Math.sqrt(variance);

        let riskLevel = 'medium';
        if (riskScore < 10) riskLevel = 'low';
        else if (riskScore > 30) riskLevel = 'high';

        return {
            totalValue,
            change24h: totalValue - totalCostBasis, // Simplified - would need historical data for real changes
            change7d: 0, // Would need historical data
            change30d: 0, // Would need historical data
            bestPerformer: performances[0] || null,
            worstPerformer: performances[performances.length - 1] || null,
            diversification: diversification.sort((a, b) => b.percentage - a.percentage),
            riskLevel,
            riskScore: Math.round(riskScore * 100) / 100
        };
    }, [coinz, marketData, exchangeRate, initialAnalytics]);

    // Update analytics when calculations change
    useEffect(() => {
        setAnalytics(calculatedAnalytics);
    }, [calculatedAnalytics]);

    // Memoized portfolio history generation
    const portfolioHistory = useMemo(() => {
        const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30;
        const history = [];

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Simulate portfolio value changes (in real app, use actual historical data)
            const baseValue = analytics.totalValue || totalPortfolio;
            const randomChange = (Math.random() - 0.5) * 0.1; // ±5% random change
            const value = baseValue * (1 + randomChange);

            history.push([date.getTime(), value]);
        }

        return history;
    }, [timeRange, analytics.totalValue, totalPortfolio]);

    // Memoized chart options for better performance
    const chartOptions = useMemo(() => ({
        chart: {
            type: 'line',
            backgroundColor: 'var(--surface-hover)',
            style: {
                color: 'var(--text-primary)'
            }
        },
        title: {
            text: 'Portfolio Value Over Time',
            style: {
                color: 'var(--text-primary)'
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                style: {
                    color: 'var(--text-secondary)'
                }
            }
        },
        yAxis: {
            title: {
                text: `Value (${currency})`,
                style: {
                    color: 'var(--text-secondary)'
                }
            },
            labels: {
                style: {
                    color: 'var(--text-secondary)'
                }
            }
        },
        series: [{
            name: 'Portfolio Value',
            data: portfolioHistory,
            color: 'var(--primary-color)',
            lineWidth: 2
        }],
        legend: {
            itemStyle: {
                color: 'var(--text-primary)'
            }
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            }
        }
    }), [portfolioHistory, currency]);

    // Memoized utility functions
    const formatCurrency = useCallback((value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }, [currency]);

    const formatPercentage = useCallback((value) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    }, []);

    // Chart rendering effect
    useEffect(() => {
        if (portfolioHistory.length > 0) {
            try {
                Highcharts.chart('portfolio-chart', chartOptions);
            } catch (error) {
                console.error('Failed to render chart:', error);
                setError('Failed to load chart data');
            }
        }
    }, [chartOptions, portfolioHistory]);

    // Time range change handler
    const handleTimeRangeChange = useCallback((newTimeRange) => {
        setTimeRange(newTimeRange);
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <AnalyticsContainer>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                    <div style={{ color: 'var(--text-secondary)' }}>Loading analytics...</div>
                </div>
            </AnalyticsContainer>
        );
    }

    // Error state
    if (error) {
        return (
            <AnalyticsContainer>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: 'var(--error-color)', marginBottom: '16px' }}>
                        <i className="fa fa-exclamation-triangle" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{error}</div>
                </div>
            </AnalyticsContainer>
        );
    }

    return (
        <AnalyticsContainer>
            <AnalyticsHeader>
                <AnalyticsTitle>Portfolio Analytics</AnalyticsTitle>
                <TimeRangeSelector>
                    <TimeRangeButton
                        active={timeRange === '24h'}
                        onClick={() => handleTimeRangeChange('24h')}
                        aria-label="View 24 hour data"
                    >
                        24h
                    </TimeRangeButton>
                    <TimeRangeButton
                        active={timeRange === '7d'}
                        onClick={() => handleTimeRangeChange('7d')}
                        aria-label="View 7 day data"
                    >
                        7d
                    </TimeRangeButton>
                    <TimeRangeButton
                        active={timeRange === '30d'}
                        onClick={() => handleTimeRangeChange('30d')}
                        aria-label="View 30 day data"
                    >
                        30d
                    </TimeRangeButton>
                </TimeRangeSelector>
            </AnalyticsHeader>

            <MetricsGrid>
                <MetricCard>
                    <MetricValue>{formatCurrency(analytics.totalValue)}</MetricValue>
                    <MetricLabel>Total Portfolio Value</MetricLabel>
                </MetricCard>
                <MetricCard>
                    <MetricValue positive={analytics.change24h >= 0} negative={analytics.change24h < 0}>
                        {formatCurrency(analytics.change24h)}
                    </MetricValue>
                    <MetricLabel>24h Change</MetricLabel>
                </MetricCard>
                <MetricCard>
                    <MetricValue positive={analytics.change7d >= 0} negative={analytics.change7d < 0}>
                        {formatCurrency(analytics.change7d)}
                    </MetricValue>
                    <MetricLabel>7d Change</MetricLabel>
                </MetricCard>
                <MetricCard>
                    <MetricValue positive={analytics.change30d >= 0} negative={analytics.change30d < 0}>
                        {formatCurrency(analytics.change30d)}
                    </MetricValue>
                    <MetricLabel>30d Change</MetricLabel>
                </MetricCard>
            </MetricsGrid>

            <ChartContainer>
                <ChartTitle>Portfolio Value Over Time</ChartTitle>
                <div id="portfolio-chart" style={{ height: '300px' }}></div>
            </ChartContainer>

            <PerformanceTable>
                <TableTitle>Performance Overview</TableTitle>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>Coin</TableHeader>
                            <TableHeader>Value</TableHeader>
                            <TableHeader>Performance</TableHeader>
                            <TableHeader>% of Portfolio</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics.diversification.map((item, index) => {
                            const coinData = marketData[item.coin.toLowerCase()];
                            const performance = coinData && coinData.ticker ?
                                ((coinData.ticker.price * exchangeRate - coinz[item.coin].cost_basis * exchangeRate) /
                                    (coinz[item.coin].cost_basis * exchangeRate)) * 100 : 0;

                            return (
                                <TableRow key={item.coin}>
                                    <TableCell>{item.coin.toUpperCase()}</TableCell>
                                    <TableCell>{formatCurrency(item.value)}</TableCell>
                                    <PerformanceCell positive={performance >= 0} negative={performance < 0}>
                                        {formatPercentage(performance)}
                                    </PerformanceCell>
                                    <TableCell>{item.percentage.toFixed(1)}%</TableCell>
                                </TableRow>
                            );
                        })}
                    </tbody>
                </Table>
            </PerformanceTable>

            <DiversificationCard>
                <DiversificationTitle>Portfolio Diversification</DiversificationTitle>
                {analytics.diversification.map((item, index) => (
                    <div key={item.coin}>
                        <DiversificationItem>
                            <CoinName>{item.coin.toUpperCase()}</CoinName>
                            <Percentage>{item.percentage.toFixed(1)}%</Percentage>
                        </DiversificationItem>
                        <ProgressBar>
                            <ProgressFill percentage={item.percentage} />
                        </ProgressBar>
                    </div>
                ))}
            </DiversificationCard>

            <RiskIndicator>
                <RiskTitle>Risk Assessment</RiskTitle>
                <RiskLevel>
                    <RiskValue level={analytics.riskLevel}>
                        {analytics.riskLevel.toUpperCase()}
                    </RiskValue>
                    <RiskLabel>Risk Level (Volatility: {analytics.riskScore}%)</RiskLabel>
                </RiskLevel>
                <RiskBar>
                    <RiskBarFill
                        level={analytics.riskLevel}
                        percentage={analytics.riskLevel === 'low' ? 25 : analytics.riskLevel === 'medium' ? 60 : 90}
                    />
                </RiskBar>
            </RiskIndicator>
        </AnalyticsContainer>
    );
};

// PropTypes for type checking
PortfolioAnalytics.propTypes = {
    coinz: PropTypes.object.isRequired,
    marketData: PropTypes.object.isRequired,
    exchangeRate: PropTypes.number,
    currency: PropTypes.string,
    totalPortfolio: PropTypes.number
};

PortfolioAnalytics.defaultProps = {
    exchangeRate: 1,
    currency: 'USD',
    totalPortfolio: 0
};

export default PortfolioAnalytics;

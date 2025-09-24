import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { RebalancingIcon as RebalancingIconSVG } from './Icons/FeatureIcons';

const RebalancingContainer = styled.div`
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  margin-bottom: 24px;
`;

const RebalancingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const RebalancingIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const RebalancingTitle = styled.h3`
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const RebalancingSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
`;

const SuggestionCard = styled.div`
  background: var(--surface-hover);
  border-radius: var(--border-radius-md);
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid ${props => {
        switch (props.type) {
            case 'buy': return 'var(--success-color)';
            case 'sell': return 'var(--error-color)';
            case 'hold': return 'var(--warning-color)';
            default: return 'var(--border-color)';
        }
    }};
`;

const SuggestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SuggestionTitle = styled.h4`
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const SuggestionType = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
        switch (props.type) {
            case 'buy': return 'var(--success-color)';
            case 'sell': return 'var(--error-color)';
            case 'hold': return 'var(--warning-color)';
            default: return 'var(--border-color)';
        }
    }};
  color: white;
`;

const SuggestionContent = styled.div`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const SuggestionActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-secondary)'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: ${props => props.primary ? 'var(--primary-hover)' : 'var(--surface-hover)'};
    border-color: var(--border-hover);
  }
`;

const RiskIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: var(--surface-hover);
  border-radius: var(--border-radius-sm);
`;

const RiskLevel = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
        switch (props.level) {
            case 'low': return 'var(--success-color)';
            case 'medium': return 'var(--warning-color)';
            case 'high': return 'var(--error-color)';
            default: return 'var(--border-color)';
        }
    }};
  color: white;
`;

const PortfolioRebalancing = ({
    coinz = {},
    marketData = {},
    exchangeRate = 1,
    currency = 'USD'
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [riskLevel, setRiskLevel] = useState('medium');

    // Get target allocation for a coin
    const getTargetAllocation = (symbol) => {
        const targets = {
            'BTC': 40,
            'ETH': 30,
            'BNB': 10,
            'ADA': 5,
            'SOL': 5,
            'DOT': 3,
            'MATIC': 3,
            'AVAX': 2,
            'LINK': 2
        };

        return targets[symbol] || (100 / Object.keys(coinz).length); // Equal allocation for unknown coins
    };

    // Generate rebalancing suggestions
    const generateRebalancingSuggestions = (allocations) => {
        const suggestions = [];

        allocations.forEach(allocation => {
            const deviation = allocation.percentage - allocation.targetPercentage;
            const threshold = 5; // 5% deviation threshold

            if (Math.abs(deviation) > threshold) {
                if (deviation > 0) {
                    // Over-allocated - suggest selling
                    suggestions.push({
                        id: `sell-${allocation.symbol}`,
                        type: 'sell',
                        symbol: allocation.symbol,
                        title: `Reduce ${allocation.symbol} Position`,
                        content: `${allocation.symbol} is ${deviation.toFixed(1)}% over your target allocation. Consider selling some to rebalance your portfolio.`,
                        currentAllocation: allocation.percentage,
                        targetAllocation: allocation.targetPercentage,
                        deviation: deviation
                    });
                } else {
                    // Under-allocated - suggest buying
                    suggestions.push({
                        id: `buy-${allocation.symbol}`,
                        type: 'buy',
                        symbol: allocation.symbol,
                        title: `Increase ${allocation.symbol} Position`,
                        content: `${allocation.symbol} is ${Math.abs(deviation).toFixed(1)}% under your target allocation. Consider buying more to rebalance your portfolio.`,
                        currentAllocation: allocation.percentage,
                        targetAllocation: allocation.targetPercentage,
                        deviation: deviation
                    });
                }
            }
        });

        // Add diversification suggestions
        if (allocations.length < 3) {
            suggestions.push({
                id: 'diversify',
                type: 'buy',
                symbol: 'DIVERSIFY',
                title: 'Increase Portfolio Diversification',
                content: 'Your portfolio has fewer than 3 assets. Consider adding more cryptocurrencies to reduce risk through diversification.',
                currentAllocation: 0,
                targetAllocation: 0,
                deviation: 0
            });
        }

        return suggestions;
    };

    // Calculate portfolio analysis
    const portfolioAnalysis = useMemo(() => {
        if (!coinz || !marketData || Object.keys(coinz).length === 0) {
            return { suggestions: [], riskLevel: 'medium' };
        }

        const coins = Object.keys(coinz);
        const analysis = {
            totalValue: 0,
            allocations: [],
            riskScore: 0,
            suggestions: []
        };

        // Calculate current allocations
        coins.forEach(coinSymbol => {
            const coin = coinz[coinSymbol];
            const coinData = marketData[coinSymbol.toLowerCase()];

            if (!coinData || !coinData.ticker) return;

            const currentPrice = coinData.ticker.price * exchangeRate;
            const coinValue = coin.hodl * currentPrice;

            analysis.totalValue += coinValue;
            analysis.allocations.push({
                symbol: coinSymbol,
                value: coinValue,
                percentage: 0, // Will be calculated after totalValue
                targetPercentage: getTargetAllocation(coinSymbol),
                volatility: coinData.ticker.change_24h || 0
            });
        });

        // Calculate percentages
        analysis.allocations.forEach(allocation => {
            allocation.percentage = (allocation.value / analysis.totalValue) * 100;
        });

        // Calculate risk score
        const avgVolatility = analysis.allocations.reduce((sum, a) => sum + Math.abs(a.volatility), 0) / analysis.allocations.length;
        analysis.riskScore = avgVolatility;

        // Generate suggestions
        analysis.suggestions = generateRebalancingSuggestions(analysis.allocations);

        return analysis;
    }, [coinz, marketData, exchangeRate]);

    // Update suggestions when analysis changes
    useEffect(() => {
        setSuggestions(portfolioAnalysis.suggestions);
        setRiskLevel(portfolioAnalysis.riskScore > 15 ? 'high' : portfolioAnalysis.riskScore > 8 ? 'medium' : 'low');
    }, [portfolioAnalysis]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const handleSuggestionAction = (suggestion, action) => {
        console.log(`${action} suggestion:`, suggestion);
        // TODO: Implement actual rebalancing actions
    };

    if (suggestions.length === 0) {
        return (
            <RebalancingContainer>
                <RebalancingHeader>
                    <RebalancingIcon>⚖️</RebalancingIcon>
                    <div>
                        <RebalancingTitle>Portfolio Rebalancing</RebalancingTitle>
                        <RebalancingSubtitle>Your portfolio is well balanced!</RebalancingSubtitle>
                    </div>
                </RebalancingHeader>

                <SuggestionCard type="hold">
                    <SuggestionContent>
                        Great job! Your portfolio allocations are within the recommended ranges.
                        No rebalancing is needed at this time.
                    </SuggestionContent>
                </SuggestionCard>
            </RebalancingContainer>
        );
    }

    return (
        <RebalancingContainer>
            <RebalancingHeader>
                <RebalancingIcon>
                    <RebalancingIconSVG />
                </RebalancingIcon>
                <div>
                    <RebalancingTitle>Portfolio Rebalancing</RebalancingTitle>
                    <RebalancingSubtitle>{suggestions.length} suggestions to optimize your portfolio</RebalancingSubtitle>
                </div>
            </RebalancingHeader>

            {suggestions.map(suggestion => (
                <SuggestionCard key={suggestion.id} type={suggestion.type}>
                    <SuggestionHeader>
                        <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                        <SuggestionType type={suggestion.type}>{suggestion.type}</SuggestionType>
                    </SuggestionHeader>

                    <SuggestionContent>
                        {suggestion.content}
                        {suggestion.currentAllocation > 0 && (
                            <div style={{ marginTop: '8px', fontSize: '13px' }}>
                                Current: {suggestion.currentAllocation.toFixed(1)}% |
                                Target: {suggestion.targetAllocation.toFixed(1)}%
                            </div>
                        )}
                    </SuggestionContent>

                    <SuggestionActions>
                        <ActionButton
                            primary
                            onClick={() => handleSuggestionAction(suggestion, 'apply')}
                        >
                            Apply Suggestion
                        </ActionButton>
                        <ActionButton onClick={() => handleSuggestionAction(suggestion, 'dismiss')}>
                            Dismiss
                        </ActionButton>
                    </SuggestionActions>
                </SuggestionCard>
            ))}

            <RiskIndicator>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Portfolio Risk Level:</span>
                <RiskLevel level={riskLevel}>{riskLevel.toUpperCase()}</RiskLevel>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Based on volatility analysis
                </span>
            </RiskIndicator>
        </RebalancingContainer>
    );
};

// PropTypes for type checking
PortfolioRebalancing.propTypes = {
    coinz: PropTypes.object.isRequired,
    marketData: PropTypes.object.isRequired,
    exchangeRate: PropTypes.number,
    currency: PropTypes.string
};

PortfolioRebalancing.defaultProps = {
    exchangeRate: 1,
    currency: 'USD'
};

export default PortfolioRebalancing;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { createAlert, addAlert, loadAlerts, removeAlert } from '../Utils/alertHelpers';

const TesterContainer = styled.div`
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

const TesterTitle = styled.h3`
  color: var(--primary-color);
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
`;

const TestButton = styled.button`
  padding: 12px 20px;
  margin: 8px;
  border: none;
  border-radius: var(--border-radius-md);
  background: var(--primary-color);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  
  &:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:disabled {
    background: var(--text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AlertList = styled.div`
  margin-top: 16px;
`;

const AlertItem = styled.div`
  background: var(--surface-hover);
  border-radius: var(--border-radius-md);
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`;

const AlertInfo = styled.div`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  border: 1px solid var(--error-color);
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--error-color);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--error-color);
    color: white;
    transform: scale(1.05);
  }
`;

const StatusInfo = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 12px;
  font-weight: 500;
`;

const AlertTester = ({ marketData, exchangeRate = 1 }) => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadTestAlerts = useCallback(async () => {
        try {
            const allAlerts = await loadAlerts();
            setAlerts(allAlerts);
        } catch (error) {
            console.error('Failed to load alerts:', error);
        }
    }, []);

    useEffect(() => {
        loadTestAlerts();
    }, [loadTestAlerts]);

    const createTestAlert = async (coinSymbol, targetPrice, alertType) => {
        setLoading(true);
        try {
            const alert = createAlert(coinSymbol, targetPrice, alertType, 'USD');
            await addAlert(alert);
            await loadTestAlerts();
        } catch (error) {
            console.error('Failed to create test alert:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = async (alertId) => {
        try {
            await removeAlert(alertId);
            await loadTestAlerts();
        } catch (error) {
            console.error('Failed to delete alert:', error);
        }
    };

    const getCurrentPrice = (coinSymbol) => {
        const coinData = marketData[coinSymbol.toLowerCase()];
        return coinData && coinData.ticker ? coinData.ticker.price * exchangeRate : 0;
    };

    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(price);
    }, []);

    // Memoized current prices
    const currentPrices = useMemo(() => ({
        BTC: getCurrentPrice('BTC'),
        ETH: getCurrentPrice('ETH')
    }), [marketData, exchangeRate]);

    // Memoized test buttons
    const testButtons = useMemo(() => [
        {
            label: 'Create BTC Alert (+1%)',
            onClick: () => createTestAlert('BTC', currentPrices.BTC * 1.01, 'above'),
            disabled: loading || !currentPrices.BTC
        },
        {
            label: 'Create BTC Alert (-1%)',
            onClick: () => createTestAlert('BTC', currentPrices.BTC * 0.99, 'below'),
            disabled: loading || !currentPrices.BTC
        },
        {
            label: 'Create ETH Alert (+2%)',
            onClick: () => createTestAlert('ETH', currentPrices.ETH * 1.02, 'above'),
            disabled: loading || !currentPrices.ETH
        },
        {
            label: 'Create ETH Alert (-2%)',
            onClick: () => createTestAlert('ETH', currentPrices.ETH * 0.98, 'below'),
            disabled: loading || !currentPrices.ETH
        }
    ], [loading, currentPrices, createTestAlert]);

    return (
        <TesterContainer>
            <TesterTitle>🚨 Alert Testing Tools</TesterTitle>

            <div>
                {testButtons.map((button, index) => (
                    <TestButton
                        key={index}
                        onClick={button.onClick}
                        disabled={button.disabled}
                    >
                        {button.label}
                    </TestButton>
                ))}
            </div>

            <StatusInfo>
                Current Prices: BTC: {formatPrice(currentPrices.BTC)}, ETH: {formatPrice(currentPrices.ETH)}
            </StatusInfo>

            {alerts.length > 0 && (
                <AlertList>
                    <h4 style={{ color: 'white', marginBottom: '12px' }}>Active Alerts ({alerts.length})</h4>
                    {alerts.map(alert => (
                        <AlertItem key={alert.id}>
                            <AlertInfo>
                                {alert.coinSymbol} {alert.alertType} {formatPrice(alert.targetPrice)}
                                <span style={{ color: '#aaa', fontSize: '12px' }}>
                                    {' '}(Current: {formatPrice(getCurrentPrice(alert.coinSymbol))})
                                </span>
                            </AlertInfo>
                            <DeleteButton onClick={() => deleteAlert(alert.id)}>
                                Delete
                            </DeleteButton>
                        </AlertItem>
                    ))}
                </AlertList>
            )}
        </TesterContainer>
    );
};

// PropTypes for type checking
AlertTester.propTypes = {
    marketData: PropTypes.object.isRequired,
    exchangeRate: PropTypes.number
};

AlertTester.defaultProps = {
    exchangeRate: 1
};

export default AlertTester;

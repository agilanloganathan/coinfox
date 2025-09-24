import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dismissAlert, ALERT_STATUS } from '../Utils/alertHelpers';

const NotificationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const NotificationCard = styled.div`
  background: #303032;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #21ce99;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const NotificationTitle = styled.h3`
  color: #21ce99;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #404042;
    color: white;
  }
`;

const AlertIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.isIncreasing ? '#21ce99' : '#ff4757'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: white;
  transition: all 0.3s ease;
`;

const AlertMessage = styled.div`
  color: white;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const PriceDirectionIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: ${props => props.isIncreasing ? 'rgba(33, 206, 153, 0.1)' : 'rgba(255, 71, 87, 0.1)'};
  border: 1px solid ${props => props.isIncreasing ? '#21ce99' : '#ff4757'};
  border-radius: 8px;
`;

const DirectionIcon = styled.div`
  font-size: 20px;
  color: ${props => props.isIncreasing ? '#21ce99' : '#ff4757'};
`;

const DirectionText = styled.div`
  color: ${props => props.isIncreasing ? '#21ce99' : '#ff4757'};
  font-weight: 600;
  font-size: 14px;
`;

const PriceChange = styled.div`
  color: ${props => props.isIncreasing ? '#21ce99' : '#ff4757'};
  font-weight: 500;
  font-size: 14px;
  margin-left: auto;
`;

const AlertDetails = styled.div`
  background: #404042;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: #aaa;
  font-size: 14px;
`;

const DetailValue = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => props.primary ? `
    background: #21ce99;
    color: white;
    
    &:hover {
      background: #1bb885;
    }
  ` : `
    background: transparent;
    color: #aaa;
    border: 1px solid #555;
    
    &:hover {
      background: #404042;
      border-color: #21ce99;
      color: white;
    }
  `}
`;

const NotificationList = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
`;

const NotificationItem = styled.div`
  background: #303032;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #21ce99;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  animation: slideInRight 0.3s ease-out;
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const NotificationItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const NotificationItemTitle = styled.div`
  color: #21ce99;
  font-weight: 600;
  font-size: 14px;
`;

const NotificationItemClose = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: white;
  }
`;

const NotificationItemMessage = styled.div`
  color: white;
  font-size: 13px;
  line-height: 1.4;
`;

const AlertNotification = ({
  alerts = [],
  onDismiss,
  showAsList = false,
  autoDismiss = true,
  autoDismissDelay = 5000
}) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    if (alerts.length > 0) {
      setVisibleAlerts(alerts);

      if (autoDismiss) {
        const timer = setTimeout(() => {
          setVisibleAlerts([]);
        }, autoDismissDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [alerts, autoDismiss, autoDismissDelay]);

  const handleDismiss = async (alertId) => {
    try {
      await dismissAlert(alertId);
      setVisibleAlerts(prev => prev.filter(alert => alert.id !== alertId));
      if (onDismiss) {
        onDismiss(alertId);
      }
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  const handleDismissAll = () => {
    visibleAlerts.forEach(alert => {
      handleDismiss(alert.id);
    });
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatAlertMessage = (alert) => {
    const coinSymbol = alert.coinSymbol;
    const currentPrice = alert.currentPrice || alert.targetPrice;
    const targetPrice = alert.targetPrice;
    const currency = alert.currency;
    const alertType = alert.alertType === 'above' ? 'above' : 'below';
    const previousPrice = alert.previousPrice;

    let directionText = '';
    if (previousPrice && currentPrice) {
      const isIncreasing = currentPrice > previousPrice;
      const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
      directionText = isIncreasing
        ? ` ↗️ Price increased by ${changePercent.toFixed(2)}%`
        : ` ↘️ Price decreased by ${Math.abs(changePercent).toFixed(2)}%`;
    }

    return `${coinSymbol} price is now ${formatPrice(currentPrice, currency)}, ${alertType} your alert of ${formatPrice(targetPrice, currency)}${directionText}`;
  };

  const getPriceDirection = (alert) => {
    if (!alert.previousPrice || !alert.currentPrice) {
      return alert.alertType === 'above' ? true : false; // Default based on alert type
    }
    return alert.currentPrice > alert.previousPrice;
  };

  const getPriceChangePercent = (alert) => {
    if (!alert.previousPrice || !alert.currentPrice) {
      return 0;
    }
    return ((alert.currentPrice - alert.previousPrice) / alert.previousPrice) * 100;
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  if (showAsList) {
    return (
      <NotificationList>
        {visibleAlerts.map(alert => (
          <NotificationItem key={alert.id}>
            <NotificationItemHeader>
              <NotificationItemTitle>
                🚨 Price Alert Triggered
              </NotificationItemTitle>
              <NotificationItemClose onClick={() => handleDismiss(alert.id)}>
                ×
              </NotificationItemClose>
            </NotificationItemHeader>
            <NotificationItemMessage>
              {formatAlertMessage(alert)}
            </NotificationItemMessage>
          </NotificationItem>
        ))}
      </NotificationList>
    );
  }

  // Show first alert as modal
  const alert = visibleAlerts[0];
  const isIncreasing = getPriceDirection(alert);
  const priceChangePercent = getPriceChangePercent(alert);

  return (
    <NotificationOverlay>
      <NotificationCard>
        <NotificationHeader>
          <NotificationTitle>🚨 Price Alert Triggered</NotificationTitle>
          <CloseButton onClick={() => handleDismiss(alert.id)}>
            ×
          </CloseButton>
        </NotificationHeader>

        <AlertIcon isIncreasing={isIncreasing}>
          {isIncreasing ? '📈' : '📉'}
        </AlertIcon>

        <PriceDirectionIndicator isIncreasing={isIncreasing}>
          <DirectionIcon isIncreasing={isIncreasing}>
            {isIncreasing ? '↗️' : '↘️'}
          </DirectionIcon>
          <DirectionText isIncreasing={isIncreasing}>
            {isIncreasing ? 'Price Increasing' : 'Price Decreasing'}
          </DirectionText>
          {priceChangePercent !== 0 && (
            <PriceChange isIncreasing={isIncreasing}>
              {isIncreasing ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </PriceChange>
          )}
        </PriceDirectionIndicator>

        <AlertMessage>
          {formatAlertMessage(alert)}
        </AlertMessage>

        <AlertDetails>
          <DetailRow>
            <DetailLabel>Coin:</DetailLabel>
            <DetailValue>{alert.coinSymbol}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Current Price:</DetailLabel>
            <DetailValue>{formatPrice(alert.currentPrice || alert.targetPrice, alert.currency)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Alert Price:</DetailLabel>
            <DetailValue>{formatPrice(alert.targetPrice, alert.currency)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Alert Type:</DetailLabel>
            <DetailValue>{alert.alertType === 'above' ? 'Above' : 'Below'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Triggered:</DetailLabel>
            <DetailValue>{new Date(alert.triggeredAt).toLocaleString()}</DetailValue>
          </DetailRow>
        </AlertDetails>

        <ActionButtons>
          <Button onClick={() => handleDismiss(alert.id)}>
            Dismiss Alert
          </Button>
          {visibleAlerts.length > 1 && (
            <Button primary onClick={handleDismissAll}>
              Dismiss All ({visibleAlerts.length})
            </Button>
          )}
        </ActionButtons>
      </NotificationCard>
    </NotificationOverlay>
  );
};

export default AlertNotification;

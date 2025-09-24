import React from 'react';
import styled from 'styled-components';
import notificationManager from '../Utils/notificationManager';

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

const NotificationTester = () => {
    const testPriceAlert = () => {
        notificationManager.addPriceAlertNotification({
            id: 'test_alert_1',
            coinSymbol: 'BTC',
            currentPrice: 45000,
            targetPrice: 44000,
            previousPrice: 43000,
            alertType: 'above',
            currency: 'USD'
        });
    };

    const testPortfolioUpdate = () => {
        notificationManager.addPortfolioNotification({
            totalValue: 125000,
            changePercent: 5.2,
            changeAmount: 6200,
            currency: 'USD'
        });
    };

    const testCoinAdded = () => {
        notificationManager.addCoinAddedNotification('ETH', 2.5);
    };

    const testMarketNews = () => {
        notificationManager.addMarketNewsNotification({
            id: 'news_1',
            title: 'Bitcoin reaches new all-time high',
            source: 'CoinDesk',
            url: 'https://example.com'
        });
    };

    const testSystemNotification = () => {
        notificationManager.addSystemNotification(
            '🔧 System Update',
            'New features have been added to your portfolio tracker'
        );
    };

    const clearAllNotifications = () => {
        notificationManager.clearAll();
    };

    return (
        <TestContainer>
            <TestTitle>🧪 Notification Tester</TestTitle>
            <p style={{ color: '#ccc', marginBottom: '15px' }}>
                Click the buttons below to test different types of dynamic notifications:
            </p>

            <div>
                <TestButton onClick={testPriceAlert}>
                    🚨 Test Price Alert
                </TestButton>

                <TestButton onClick={testPortfolioUpdate}>
                    📊 Test Portfolio Update
                </TestButton>

                <TestButton onClick={testCoinAdded}>
                    ➕ Test Coin Added
                </TestButton>

                <TestButton onClick={testMarketNews}>
                    📰 Test Market News
                </TestButton>

                <TestButton onClick={testSystemNotification}>
                    🔧 Test System Notification
                </TestButton>

                <TestButton onClick={clearAllNotifications} style={{ background: '#dc3545' }}>
                    🗑️ Clear All Notifications
                </TestButton>
            </div>

            <p style={{ color: '#888', fontSize: '12px', marginTop: '15px' }}>
                Check the notification bell icon in the header to see the dynamic notifications!
            </p>
        </TestContainer>
    );
};

export default NotificationTester;

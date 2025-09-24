import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { MenuIcon } from './Icons/NavigationIcons';
import NotificationDropdown from './NotificationDropdown';
import notificationManager from '../Utils/notificationManager';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #1a1a1a;
  padding-bottom: 80px; /* Extra space for Windows taskbar */
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.sidebarOpen ? '360px' : '0'};
  transition: margin-left 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const PageHeader = styled.header`
  background: linear-gradient(135deg, #21ce99 0%, #1bb584 100%);
  border-bottom: 1px solid #1bb584;
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(33, 206, 153, 0.2);
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const PageTitle = styled.h1`
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  text-align: center;
`;

const PageContent = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 100px; /* Extra space for taskbar and toggle button */
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PageLayout = ({
  children,
  title,
  currentPath,
  blockstack = false,
  supportedCurrencies = [],
  saveNewPref = () => { },
  language = 'EN',
  currency = 'USD',
  addCoinz = () => { },
  notifications = []
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dynamicNotifications, setDynamicNotifications] = useState([]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClearNotifications = () => {
    notificationManager.clearAll();
  };

  // Subscribe to dynamic notifications
  useEffect(() => {
    const unsubscribe = notificationManager.subscribe((notifications) => {
      setDynamicNotifications(notifications);
    });

    // Get initial notifications
    setDynamicNotifications(notificationManager.getAllNotifications());

    return unsubscribe;
  }, []);

  // Use dynamic notifications if available, otherwise fall back to passed notifications
  const displayNotifications = dynamicNotifications.length > 0 ? dynamicNotifications : notifications;

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <PageContainer>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        currentPath={currentPath}
        blockstack={blockstack}
        supportedCurrencies={supportedCurrencies}
        saveNewPref={saveNewPref}
        language={language}
        currency={currency}
        addCoinz={addCoinz}
      />

      <MainContent sidebarOpen={sidebarOpen}>
        <PageHeader>
          <MenuButton onClick={handleMenuToggle}>
            <MenuIcon />
            Menu
          </MenuButton>
          <PageTitle>{title}</PageTitle>
          <HeaderActions>
            <NotificationDropdown
              notifications={displayNotifications}
              onClearAll={handleClearNotifications}
            />
          </HeaderActions>
        </PageHeader>

        <PageContent>
          {children}
        </PageContent>
      </MainContent>
    </PageContainer>
  );
};

export default PageLayout;

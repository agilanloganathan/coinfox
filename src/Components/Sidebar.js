import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AddCoin from './AddCoin';
import CurrencyPref from './CurrencyPref';
import LanguagePref from './LanguagePref';
import ImportExport from './ImportExport';
import CoinfoxLogo from './Logos/CoinfoxLogo';
import { DashboardIcon, AnalyticsIcon, CoinsIcon } from './Icons/NavigationIcons';
import { CloseIcon } from './Icons/NavigationIcons';
import { translationStrings } from '../Utils/i18n';

// Styled Components for Modern Sidebar
const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 360px;
  height: 100vh;
  background: #1a1a1a;
  border-right: 1px solid #333;
  z-index: 1000;
  overflow-y: auto;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SidebarHeader = styled.div`
  padding: 32px 28px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2a2a2a;
`;

const SidebarTitle = styled.h2`
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  letter-spacing: -0.5px;
`;


const CloseButton = styled.button`
  color: var(--text-secondary);
  font-size: 20px;
  padding: 12px;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    color: var(--text-primary);
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: scale(1.05);
  }
`;

const SidebarContent = styled.div`
  padding: 24px 0;
`;

const MenuSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px 24px;
`;

const MenuItem = styled.div`
  padding: 0 24px;
  margin-bottom: 8px;
`;

const NavigationLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #2a2a2a;
  border-radius: 8px;
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #333;
  margin-bottom: 8px;
  
  &:hover {
    background: #21ce99;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 206, 153, 0.3);
  }
  
  &.active {
    background: #21ce99;
    color: white;
    border-color: #21ce99;
  }
`;

const NavIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const PromoSection = styled.div`
  margin: 24px;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: var(--border-radius-md);
  text-align: center;
`;

const PromoTitle = styled.h4`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const PromoText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const PromoLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-style: italic;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FooterSection = styled.div`
  margin: 24px;
  padding: 20px;
  background: var(--surface-hover);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
`;

const FooterText = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
  text-align: center;
  line-height: 1.5;
`;

const FooterLink = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isOpen ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Sidebar = ({
  isOpen,
  onClose,
  currentPath,
  blockstack = false,
  supportedCurrencies = [],
  saveNewPref = () => { },
  language = 'EN',
  currency = 'USD',
  addCoinz = () => { }
}) => {
  const home = blockstack ? '/blockstack' : '/';
  const string = translationStrings(language);

  const navigationItems = [
    { path: home, label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { path: '/supportedcoins', label: 'Supported Coins', icon: <CoinsIcon /> }
  ];

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>
            <CoinfoxLogo size="40px" fontSize="18px" />
            
          </SidebarTitle>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </SidebarHeader>

        <SidebarContent>
          <MenuSection>
            <SectionTitle>Navigation</SectionTitle>

            {navigationItems.map((item, index) => (
              <MenuItem key={index}>
                <NavigationLink
                  to={item.path}
                  className={currentPath === item.path ? 'active' : ''}
                >
                  <NavIcon>{item.icon}</NavIcon>
                  {item.label}
                </NavigationLink>
              </MenuItem>
            ))}
          </MenuSection>

          <MenuSection>
            <SectionTitle>Portfolio Management</SectionTitle>

            <MenuItem>
              <AddCoin
                language={language}
                addCoinz={addCoinz}
                key='AddCoin'
              />
            </MenuItem>

            <MenuItem>
              <ImportExport language={language} />
            </MenuItem>
          </MenuSection>

          <MenuSection>
            <SectionTitle>Preferences</SectionTitle>

            <MenuItem>
              <CurrencyPref
                supportedCurrencies={supportedCurrencies}
                saveNewPref={saveNewPref}
                language={language}
                currency={currency}
                key="CurrencyPref"
              />
            </MenuItem>

            <MenuItem>
              <LanguagePref
                saveNewPref={saveNewPref}
                language={language}
                key="LanguagePref"
              />
            </MenuItem>
          </MenuSection>

          <PromoSection>
            <PromoTitle>🚀 Crypto Backed Loans</PromoTitle>
            <PromoText>
              Leverage your hodlings with a crypto backed loan through Rocko DeFi!
            </PromoText>
            <PromoLink href="https://rocko.co" target="_blank" rel="noopener noreferrer">
              Learn More →
            </PromoLink>
          </PromoSection>

          <FooterSection>
            <FooterText>
              <FooterLink href="https://github.com/vinniejames/coinfox" target="_blank" rel="noopener noreferrer">
                {string.learnmore}
              </FooterLink>
              {' '}or{' '}
              <FooterLink href="https://github.com/vinniejames/coinfox/issues" target="_blank" rel="noopener noreferrer">
                {string.givefeedback}
              </FooterLink>
            </FooterText>
          </FooterSection>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;

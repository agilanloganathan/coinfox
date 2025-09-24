import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import NotificationIcon from './Icons/NotificationIcon';

const NotificationContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NotificationButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  border: 2px solid white;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  max-width: 400px;
  z-index: 1000;
  margin-top: 8px;
  backdrop-filter: blur(20px);
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #444;
  background: #333;
`;

const DropdownTitle = styled.h3`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #333;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  color: #cccccc;
  font-size: 12px;
  line-height: 1.4;
`;

const NotificationTime = styled.div`
  color: #888;
  font-size: 11px;
  margin-top: 4px;
`;

const EmptyState = styled.div`
  padding: 32px 20px;
  text-align: center;
  color: #888;
  font-size: 14px;
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #21ce99;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(33, 206, 153, 0.1);
  }
`;

const NotificationDropdown = ({ notifications = [], onClearAll }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const formatTime = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return time.toLocaleDateString();
    };

    return (
        <NotificationContainer ref={dropdownRef}>
            <NotificationButton onClick={() => setIsOpen(!isOpen)}>
                <NotificationIcon size="20" />
                {unreadCount > 0 && (
                    <NotificationBadge>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </NotificationBadge>
                )}
            </NotificationButton>

            {isOpen && (
                <Dropdown>
                    <DropdownHeader>
                        <DropdownTitle>
                            <NotificationIcon size="16" />
                            Notifications
                            {unreadCount > 0 && (
                                <ClearButton onClick={onClearAll}>
                                    Clear All
                                </ClearButton>
                            )}
                        </DropdownTitle>
                    </DropdownHeader>

                    <NotificationList>
                        {notifications.length === 0 ? (
                            <EmptyState>
                                No notifications yet
                            </EmptyState>
                        ) : (
                            notifications.slice(0, 10).map((notification, index) => (
                                <NotificationItem key={index}>
                                    <NotificationTitle>
                                        {notification.title}
                                    </NotificationTitle>
                                    <NotificationMessage>
                                        {notification.message}
                                    </NotificationMessage>
                                    <NotificationTime>
                                        {formatTime(notification.timestamp)}
                                    </NotificationTime>
                                </NotificationItem>
                            ))
                        )}
                    </NotificationList>
                </Dropdown>
            )}
        </NotificationContainer>
    );
};

export default NotificationDropdown;

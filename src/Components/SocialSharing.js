import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ShareIcon as ShareIconSVG } from './Icons/FeatureIcons';
import { TwitterIcon, LinkedInIcon, RedditIcon, FacebookIcon, EmailIcon, CopyIcon } from './Icons/SocialIcons';

const SharingContainer = styled.div`
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  margin-bottom: 24px;
`;

const SharingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const SharingIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const SharingTitle = styled.h3`
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const SharingSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
`;

const ShareOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ShareCard = styled.div`
  background: var(--surface-hover);
  border-radius: var(--border-radius-md);
  padding: 20px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }
`;

const ShareIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
`;

const ShareName = styled.h4`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const ShareDescription = styled.p`
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0 0 16px 0;
`;

const ShareButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: ${props => props.color || 'var(--primary-color)'};
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background: ${props => props.hoverColor || 'var(--primary-hover)'};
  }
`;

const CustomShare = styled.div`
  background: var(--surface-hover);
  border-radius: var(--border-radius-md);
  padding: 20px;
  border: 1px solid var(--border-color);
`;

const CustomShareTitle = styled.h4`
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const ShareTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--background-color);
  color: var(--text-primary);
  font-size: 14px;
  resize: vertical;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--border-hover);
  }
`;

const CopyButton = styled.button`
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background: var(--primary-hover);
  }
`;

const SuccessMessage = styled.div`
  background: var(--success-color);
  color: white;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SocialSharing = ({
    coinz = {},
    marketData = {},
    exchangeRate = 1,
    currency = 'USD',
    totalPortfolio = 0,
    portfolioChange = 0
}) => {
    const [customMessage, setCustomMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Generate sharing data
    const sharingData = useMemo(() => {
        if (!coinz || !marketData || Object.keys(coinz).length === 0) {
            return null;
        }

        const coins = Object.keys(coinz);
        const topCoins = coins.slice(0, 3).map(symbol => symbol.toUpperCase()).join(', ');

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        };

        const formatPercentage = (value) => {
            return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
        };

        return {
            portfolioValue: formatCurrency(totalPortfolio),
            portfolioChange: formatPercentage(portfolioChange),
            topCoins: topCoins,
            coinCount: coins.length,
            timestamp: new Date().toLocaleDateString()
        };
    }, [coinz, marketData, exchangeRate, currency, totalPortfolio, portfolioChange]);

    // Generate default sharing message
    const defaultMessage = useMemo(() => {
        if (!sharingData) return '';

        return `🚀 My crypto portfolio is worth ${sharingData.portfolioValue} (${sharingData.portfolioChange})! 
    
Top holdings: ${sharingData.topCoins}
Total assets: ${sharingData.coinCount}

Tracked with Coinfox 🦊
#crypto #portfolio #blockchain`;
    }, [sharingData]);

    // Share to Twitter
    const shareToTwitter = () => {
        if (!sharingData) return;

        const text = customMessage || defaultMessage;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    // Share to LinkedIn
    const shareToLinkedIn = () => {
        if (!sharingData) return;

        const text = customMessage || defaultMessage;
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    // Share to Reddit
    const shareToReddit = () => {
        if (!sharingData) return;

        const text = customMessage || defaultMessage;
        const url = `https://reddit.com/submit?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    // Share to Facebook
    const shareToFacebook = () => {
        if (!sharingData) return;

        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        const text = customMessage || defaultMessage;

        try {
            await navigator.clipboard.writeText(text);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    // Share via email
    const shareViaEmail = () => {
        if (!sharingData) return;

        const subject = 'My Crypto Portfolio Performance';
        const body = customMessage || defaultMessage;
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
    };

    const shareOptions = [
        {
            id: 'twitter',
            name: 'Twitter',
            description: 'Share on Twitter',
            icon: <TwitterIcon color="#1DA1F2" />,
            color: '#1DA1F2',
            hoverColor: '#0d8bd9',
            action: shareToTwitter
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            description: 'Share on LinkedIn',
            icon: <LinkedInIcon color="#0077B5" />,
            color: '#0077B5',
            hoverColor: '#005885',
            action: shareToLinkedIn
        },
        {
            id: 'reddit',
            name: 'Reddit',
            description: 'Share on Reddit',
            icon: <RedditIcon color="#FF4500" />,
            color: '#FF4500',
            hoverColor: '#e63e00',
            action: shareToReddit
        },
        {
            id: 'facebook',
            name: 'Facebook',
            description: 'Share on Facebook',
            icon: <FacebookIcon color="#1877F2" />,
            color: '#1877F2',
            hoverColor: '#166fe5',
            action: shareToFacebook
        },
        {
            id: 'email',
            name: 'Email',
            description: 'Share via Email',
            icon: <EmailIcon color="#6B7280" />,
            color: '#6B7280',
            hoverColor: '#4B5563',
            action: shareViaEmail
        },
        {
            id: 'copy',
            name: 'Copy Link',
            description: 'Copy to clipboard',
            icon: <CopyIcon color="#10B981" />,
            color: '#10B981',
            hoverColor: '#059669',
            action: copyToClipboard
        }
    ];

    if (!sharingData) {
        return (
            <SharingContainer>
                <SharingHeader>
                    <SharingIcon>
                        <ShareIconSVG />
                    </SharingIcon>
                    <div>
                        <SharingTitle>Social Sharing</SharingTitle>
                        <SharingSubtitle>Add some coins to your portfolio to start sharing!</SharingSubtitle>
                    </div>
                </SharingHeader>
            </SharingContainer>
        );
    }

    return (
        <SharingContainer>
            <SharingHeader>
                <SharingIcon>
                    <ShareIconSVG />
                </SharingIcon>
                <div>
                    <SharingTitle>Social Sharing</SharingTitle>
                    <SharingSubtitle>Share your portfolio performance with the world!</SharingSubtitle>
                </div>
            </SharingHeader>

            <ShareOptions>
                {shareOptions.map(option => (
                    <ShareCard key={option.id} onClick={option.action}>
                        <ShareIcon>{option.icon}</ShareIcon>
                        <ShareName>{option.name}</ShareName>
                        <ShareDescription>{option.description}</ShareDescription>
                        <ShareButton color={option.color} hoverColor={option.hoverColor}>
                            Share
                        </ShareButton>
                    </ShareCard>
                ))}
            </ShareOptions>

            <CustomShare>
                <CustomShareTitle>Customize Your Message</CustomShareTitle>
                <ShareTextArea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder={defaultMessage}
                />
                <CopyButton onClick={copyToClipboard}>
                    Copy Message
                </CopyButton>
                {showSuccess && (
                    <SuccessMessage>
                        ✅ Message copied to clipboard!
                    </SuccessMessage>
                )}
            </CustomShare>
        </SharingContainer>
    );
};

// PropTypes for type checking
SocialSharing.propTypes = {
    coinz: PropTypes.object.isRequired,
    marketData: PropTypes.object.isRequired,
    exchangeRate: PropTypes.number,
    currency: PropTypes.string,
    totalPortfolio: PropTypes.number,
    portfolioChange: PropTypes.number
};

SocialSharing.defaultProps = {
    exchangeRate: 1,
    currency: 'USD',
    totalPortfolio: 0,
    portfolioChange: 0
};

export default SocialSharing;

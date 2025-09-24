import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoImage = styled.img`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  object-fit: contain;
  border-radius: ${props => props.borderRadius || '8px'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoText = styled.span`
  font-size: ${props => props.fontSize || '18px'};
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const CoinfoxLogo = ({ size, fontSize, borderRadius, className, showText = true }) => {
  return (
    <LogoContainer className={className}>
      <LogoImage
        src="/mobile-icon.png"
        alt="Coinfox Logo"
        size={size}
        borderRadius={borderRadius}
      />
      {showText && (
        <LogoText fontSize={fontSize}>Coinfox</LogoText>
      )}
    </LogoContainer>
  );
};

export default CoinfoxLogo;

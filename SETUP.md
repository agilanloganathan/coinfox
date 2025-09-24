# CoinFox Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
# Check Node.js version (should be 14+)
node --version

# Check npm version
npm --version
```

### 2. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd coinfox

# Install dependencies
npm install 
```

### 3. Start Development
```bash
# Start the development server
npm start
```

### 4. Open Browser
Navigate to `http://localhost:3000`

## What You'll See

1. **Welcome Screen**: Professional landing page with CoinFox branding
2. **Dynamic Notifications**: Welcome notifications in the header bell icon
3. **Portfolio Setup**: Add your first cryptocurrency
4. **Testing Tools**: Notification tester for feature demonstration

## Key Features to Test

### 🧪 Notification System
1. Click the notification bell (🔔) in the header
2. Use the "Notification Tester" on the home page
3. Test different notification types:
   - Price alerts
   - Portfolio updates
   - Coin added notifications
   - System notifications

### 📊 Portfolio Management
1. Add a cryptocurrency (e.g., Bitcoin)
2. Set holdings amount and cost basis
3. View real-time portfolio value
4. Set price alerts

### 🚨 Alert System
1. Create a price alert
2. Wait for real-time updates (up to 30 seconds)
3. Check notifications when alerts trigger

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (if needed)
npm run eject
```

## Project Architecture

### Core Components
- **App.js**: Main application with routing and state management
- **PageLayout.js**: Layout wrapper with header and sidebar
- **Sidebar.js**: Navigation menu
- **NotificationDropdown.js**: Dynamic notification display

### Advanced Features
- **enhancedAlertManager.js**: Central alert management system
- **notificationManager.js**: Dynamic notification system
- **pushNotificationService.js**: Browser push notifications
- **websocketService.js**: Real-time data streaming
- **dynamicNotificationService.js**: Rich notification content

### Data Flow
1. **Market Data**: Fetched from CoinGecko, Binance, CryptoCompare
2. **Real-time Updates**: WebSocket connections for live prices
3. **Alert Processing**: Enhanced alert manager processes triggers
4. **Notifications**: Dynamic notifications with real-time data
5. **Storage**: Blockstack for decentralized data persistence

## Configuration Files

### package.json
- React 18 with modern hooks
- Styled Components for CSS-in-JS
- Highcharts for data visualization
- Blockstack for decentralized storage

### tsconfig.json
- TypeScript configuration
- Strict type checking
- Modern ES features

### config-overrides.js
- Webpack configuration overrides
- Custom build optimizations

## Environment Setup

### Required APIs (Optional)
```env
# Add to .env file for enhanced features
REACT_APP_COINGECKO_API_KEY=your_key_here
REACT_APP_BINANCE_API_KEY=your_key_here
REACT_APP_CRYPTOCOMPARE_API_KEY=your_key_here
```

### Browser Permissions
- **Notifications**: Allow for push notifications
- **Storage**: Local storage for preferences
- **WebSocket**: Real-time data connections

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Then restart
npm start
```

#### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Blockstack Connection Issues
- Ensure modern browser (Chrome, Firefox, Safari)
- Check if Blockstack extension is installed
- Try incognito/private browsing mode

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'true');
// Refresh page to see debug logs
```

## Feature Testing Checklist

- [ ] Application loads without errors
- [ ] Header notifications display correctly
- [ ] Sidebar navigation works
- [ ] Add coin functionality works
- [ ] Portfolio value updates in real-time
- [ ] Price alerts can be created
- [ ] Notifications trigger correctly
- [ ] Responsive design works on mobile
- [ ] Dark theme displays properly
- [ ] Professional logos render correctly

## Next Steps

1. **Customize Branding**: Update logos and colors in `src/Components/Logos/`
2. **Add More Coins**: Extend supported cryptocurrency list
3. **Configure APIs**: Add API keys for enhanced data
4. **Deploy**: Build and deploy to your preferred platform

## Support

- Check browser console for errors
- Review network tab for API issues
- Test in different browsers
- Verify all dependencies are installed

---

**Ready to start?** Run `npm start` and open `http://localhost:3000`!








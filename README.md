# CoinFox - Advanced Cryptocurrency Portfolio Tracker

A professional React.js application for tracking cryptocurrency portfolios with real-time alerts, analytics, and advanced features.

## 🚀 Features

### Core Portfolio Management

- **Portfolio Tracking**: Track multiple cryptocurrencies with real-time price updates
- **Blockstack Integration**: Decentralized data storage using Blockstack/Stacks
- **Multi-Currency Support**: Support for USD, EUR, GBP, JPY, and more
- **Internationalization**: Multi-language support (EN, ES, FR, DE, etc.)

### Advanced Analytics & Alerts

- **Real-Time Price Alerts**: Set custom price alerts with instant notifications
- **Portfolio Analytics**: Comprehensive portfolio performance analysis
- **Risk Assessment**: Portfolio diversification and risk metrics
- **Performance Tracking**: Historical performance charts and metrics

### Professional UI/UX

- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with dark theme
- **Dynamic Notifications**: Real-time notification system in header
- **Interactive Charts**: Highcharts integration for data visualization

### Advanced Features

- **Push Notifications**: Browser-native push notifications for alerts
- **Portfolio Rebalancing**: Smart rebalancing suggestions
- **Exportable Reports**: Generate PDF, CSV, and JSON reports
- **Social Sharing**: Share portfolio performance on social media
- **WebSocket Integration**: Real-time data streaming from multiple exchanges
- **Dynamic Notifications**: Context-rich notifications with market data

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with JavaScript enabled

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd coinfox
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm start
# or
yarn start
```

The application will open in your browser at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── Components/           # Reusable UI components
│   ├── AlertNotification.js    # Alert display component
│   ├── Chart.js                # Chart components
│   ├── Dashboard.js            # Main dashboard
│   ├── NotificationTester.js   # Notification testing tool
│   ├── PageLayout.js           # Main layout wrapper
│   ├── Sidebar.js              # Navigation sidebar
│   └── Logos/                  # Professional logo components
├── Pages/                # Page components
│   ├── Home.js                 # Home page
│   ├── Analytics.js            # Analytics page
│   └── Menu.js                 # Menu page
├── Utils/                # Utility functions
│   ├── enhancedAlertManager.js    # Advanced alert system
│   ├── notificationManager.js     # Dynamic notifications
│   ├── pushNotificationService.js # Push notifications
│   ├── websocketService.js        # WebSocket connections
│   ├── dynamicNotificationService.js # Rich notifications
│   └── realTimeDataFetcher.js    # Real-time data fetching
└── App.js                # Main application component
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_COINGECKO_API_KEY=your_coingecko_api_key
REACT_APP_BINANCE_API_KEY=your_binance_api_key
REACT_APP_CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key
```

### Blockstack Configuration

The app uses Blockstack for decentralized storage. Users can sign in with their Blockstack ID for secure data storage.

## 📱 Usage

### Getting Started

1. **Launch the Application**: Open `http://localhost:3000`
2. **Set Preferences**: Configure your preferred currency and language
3. **Add Cryptocurrencies**: Add coins to your portfolio with holdings and cost basis
4. **Set Alerts**: Create price alerts for your holdings
5. **Monitor Performance**: View real-time portfolio analytics

### Key Features Usage

#### Portfolio Management

- Add cryptocurrencies with current holdings and average cost
- Track portfolio value in real-time
- View performance metrics and charts

#### Price Alerts

- Set custom price alerts (above/below target price)
- Receive instant notifications via browser push notifications
- View alert history and status

#### Analytics Dashboard

- Portfolio performance over time
- Risk assessment and diversification metrics
- Export reports in multiple formats

#### Dynamic Notifications

- Real-time notifications in header dropdown
- Context-rich alerts with market data
- Portfolio update notifications
- System notifications and updates

## 🧪 Testing Features

### Notification Tester

Use the Notification Tester component on the Home page to test:

- Price alert notifications
- Portfolio update notifications
- Coin added notifications
- Market news notifications
- System notifications

### Alert Testing

- Set up test alerts with different price targets
- Monitor real-time alert triggering
- Test notification delivery and formatting

## 🔌 API Integrations

### Data Sources

- **CoinGecko API**: Primary cryptocurrency data
- **Binance API**: Real-time trading data
- **CryptoCompare API**: Additional market data
- **WebSocket Streams**: Real-time price updates

### External Services

- **Blockstack/Stacks**: Decentralized storage
- **Push Notifications API**: Browser notifications
- **Social Media APIs**: Portfolio sharing

## 🎨 UI/UX Features

### Design System

- **Color Scheme**: Professional dark theme with accent colors
- **Typography**: Consistent font sizing and hierarchy
- **Spacing**: Standardized margins and padding
- **Components**: Reusable styled components

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layout for tablets
- **Desktop Enhancement**: Enhanced features for desktop

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and descriptions
- **High Contrast**: Accessible color combinations

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm install -g gh-pages
npm run deploy
```

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

## 🔒 Security Features

- **Decentralized Storage**: User data stored on Blockstack
- **No Centralized Database**: Privacy-focused architecture
- **Secure API Keys**: Environment variable management
- **HTTPS Enforcement**: Secure connections only

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: Optimized re-rendering
- **WebSocket Connections**: Efficient real-time updates
- **Caching**: API response caching
- **Bundle Optimization**: Minimized bundle size

## 🐛 Troubleshooting

### Common Issues

#### Development Server Won't Start

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Blockstack Connection Issues

- Ensure you're using a modern browser
- Check if Blockstack extension is installed
- Verify network connectivity

#### API Rate Limits

- Check API key configuration
- Monitor API usage in browser console
- Implement proper rate limiting

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem("debug", "true");
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **CoinGecko**: Cryptocurrency data API
- **Blockstack**: Decentralized storage platform
- **React**: Frontend framework
- **Highcharts**: Charting library
- **Styled Components**: CSS-in-JS styling

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

## 🔄 Recent Updates

### Version 2.0 Features

- ✅ Real-time portfolio alerts with dynamic notifications
- ✅ Enhanced analytics dashboard with risk assessment
- ✅ Professional UI/UX with responsive design
- ✅ Push notifications for price alerts
- ✅ Portfolio rebalancing suggestions
- ✅ Exportable analytics reports
- ✅ Social sharing capabilities
- ✅ WebSocket integration for real-time data
- ✅ Dynamic notification system
- ✅ Professional logo components
- ✅ Comprehensive testing tools

---

**CoinFox** - Professional cryptocurrency portfolio tracking made simple.

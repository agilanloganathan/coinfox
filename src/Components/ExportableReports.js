import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ExportIcon, TrendingUpIcon, DollarIcon } from './Icons/FeatureIcons';
import { AnalyticsIcon } from './Icons/NavigationIcons';

const ReportsContainer = styled.div`
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  margin-bottom: 24px;
`;

const ReportsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const ReportsIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const ReportsTitle = styled.h3`
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const ReportsSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
`;

const ReportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ReportCard = styled.div`
  background: var(--surface-hover);
  border-radius: var(--border-radius-md);
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }
`;

const ReportIcon = styled.div`
  font-size: 24px;
  margin-bottom: 12px;
`;

const ReportName = styled.h4`
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const ReportDescription = styled.p`
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const ReportButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background: var(--primary-hover);
  }
  
  &:disabled {
    background: var(--border-color);
    cursor: not-allowed;
  }
`;

const ExportOptions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
`;

const ExportButton = styled.button`
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-secondary)'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: ${props => props.primary ? 'var(--primary-hover)' : 'var(--surface-hover)'};
    border-color: var(--border-hover);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
`;

const ExportableReports = ({
  coinz = {},
  marketData = {},
  exchangeRate = 1,
  currency = 'USD',
  totalPortfolio = 0,
  portfolioHistory = []
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Generate report data
  const reportData = useMemo(() => {
    if (!coinz || !marketData || Object.keys(coinz).length === 0) {
      return null;
    }

    const coins = Object.keys(coinz);
    const portfolioData = {
      totalValue: totalPortfolio,
      currency: currency,
      generatedAt: new Date().toISOString(),
      coins: []
    };

    // Calculate coin data
    coins.forEach(coinSymbol => {
      const coin = coinz[coinSymbol];
      const coinData = marketData[coinSymbol.toLowerCase()];

      if (!coinData || !coinData.ticker) return;

      const currentPrice = coinData.ticker.price * exchangeRate;
      const coinValue = coin.hodl * currentPrice;
      const costBasis = coin.hodl * coin.cost_basis * exchangeRate;
      const profitLoss = coinValue - costBasis;
      const profitLossPercent = ((currentPrice - coin.cost_basis * exchangeRate) / (coin.cost_basis * exchangeRate)) * 100;

      portfolioData.coins.push({
        symbol: coinSymbol,
        amount: coin.hodl,
        currentPrice: currentPrice,
        costBasis: coin.cost_basis * exchangeRate,
        currentValue: coinValue,
        profitLoss: profitLoss,
        profitLossPercent: profitLossPercent,
        change24h: coinData.ticker.change_24h || 0,
        marketCap: coinData.ticker.market_cap || 0,
        volume: coinData.ticker.volume_24h || 0
      });
    });

    // Sort by value
    portfolioData.coins.sort((a, b) => b.currentValue - a.currentValue);

    return portfolioData;
  }, [coinz, marketData, exchangeRate, currency, totalPortfolio]);

  // Export functions
  const exportToCSV = () => {
    if (!reportData) return;

    const csvContent = generateCSV(reportData);
    downloadFile(csvContent, 'portfolio-report.csv', 'text/csv');
  };

  const exportToJSON = () => {
    if (!reportData) return;

    const jsonContent = JSON.stringify(reportData, null, 2);
    downloadFile(jsonContent, 'portfolio-report.json', 'application/json');
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      // Generate HTML content for PDF
      const htmlContent = generateHTMLReport(reportData);

      // Create a new window with the HTML content
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      setLoading(false);
    }
  };

  const generateCSV = (data) => {
    const headers = [
      'Symbol',
      'Amount',
      'Current Price',
      'Cost Basis',
      'Current Value',
      'Profit/Loss',
      'Profit/Loss %',
      '24h Change %'
    ];

    const rows = data.coins.map(coin => [
      coin.symbol,
      coin.amount,
      coin.currentPrice.toFixed(8),
      coin.costBasis.toFixed(2),
      coin.currentValue.toFixed(2),
      coin.profitLoss.toFixed(2),
      coin.profitLossPercent.toFixed(2),
      coin.change24h.toFixed(2)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateHTMLReport = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Coinfox Portfolio Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f8f9fa; font-weight: 600; }
          .positive { color: #28a745; }
          .negative { color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🦊 Coinfox Portfolio Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h2>Portfolio Summary</h2>
          <p><strong>Total Value:</strong> ${data.totalValue.toLocaleString()} ${data.currency}</p>
          <p><strong>Number of Assets:</strong> ${data.coins.length}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Amount</th>
              <th>Current Price</th>
              <th>Current Value</th>
              <th>Profit/Loss</th>
              <th>Profit/Loss %</th>
              <th>24h Change %</th>
            </tr>
          </thead>
          <tbody>
            ${data.coins.map(coin => `
              <tr>
                <td>${coin.symbol}</td>
                <td>${coin.amount.toFixed(8)}</td>
                <td>$${coin.currentPrice.toFixed(8)}</td>
                <td>$${coin.currentValue.toFixed(2)}</td>
                <td class="${coin.profitLoss >= 0 ? 'positive' : 'negative'}">
                  $${coin.profitLoss.toFixed(2)}
                </td>
                <td class="${coin.profitLossPercent >= 0 ? 'positive' : 'negative'}">
                  ${coin.profitLossPercent.toFixed(2)}%
                </td>
                <td class="${coin.change24h >= 0 ? 'positive' : 'negative'}">
                  ${coin.change24h.toFixed(2)}%
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reportTypes = [
    {
      id: 'portfolio',
      name: 'Portfolio Report',
      description: 'Complete overview of your cryptocurrency holdings',
      icon: <AnalyticsIcon color="#21ce99" />,
      action: () => setSelectedReport('portfolio')
    },
    {
      id: 'performance',
      name: 'Performance Report',
      description: 'Detailed analysis of your portfolio performance',
      icon: <TrendingUpIcon color="#21ce99" />,
      action: () => setSelectedReport('performance')
    },
    {
      id: 'tax',
      name: 'Tax Report',
      description: 'Transaction history for tax purposes',
      icon: <DollarIcon color="#21ce99" />,
      action: () => setSelectedReport('tax')
    }
  ];

  return (
    <ReportsContainer>
      <ReportsHeader>
        <ReportsIcon>
          <ExportIcon />
        </ReportsIcon>
        <div>
          <ReportsTitle>Exportable Reports</ReportsTitle>
          <ReportsSubtitle>Generate and download detailed portfolio reports</ReportsSubtitle>
        </div>
      </ReportsHeader>

      <ReportOptions>
        {reportTypes.map(report => (
          <ReportCard key={report.id} onClick={report.action}>
            <ReportIcon>{report.icon}</ReportIcon>
            <ReportName>{report.name}</ReportName>
            <ReportDescription>{report.description}</ReportDescription>
            <ReportButton>Generate Report</ReportButton>
          </ReportCard>
        ))}
      </ReportOptions>

      {selectedReport && (
        <ExportOptions>
          <ExportButton
            primary
            onClick={exportToCSV}
            disabled={loading}
          >
            {loading && <LoadingSpinner />}
            Export CSV
          </ExportButton>
          <ExportButton
            onClick={exportToJSON}
            disabled={loading}
          >
            Export JSON
          </ExportButton>
          <ExportButton
            onClick={exportToPDF}
            disabled={loading}
          >
            Export PDF
          </ExportButton>
        </ExportOptions>
      )}
    </ReportsContainer>
  );
};

// PropTypes for type checking
ExportableReports.propTypes = {
  coinz: PropTypes.object.isRequired,
  marketData: PropTypes.object.isRequired,
  exchangeRate: PropTypes.number,
  currency: PropTypes.string,
  totalPortfolio: PropTypes.number,
  portfolioHistory: PropTypes.array
};

ExportableReports.defaultProps = {
  exchangeRate: 1,
  currency: 'USD',
  totalPortfolio: 0,
  portfolioHistory: []
};

export default ExportableReports;

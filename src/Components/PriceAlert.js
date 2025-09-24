import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  createAlert,
  addAlert,
  removeAlert,
  loadAlerts,
  getAlertsForCoin,
  ALERT_TYPE,
  ALERT_STATUS,
  validateAlert
} from '../Utils/alertHelpers';

const AlertContainer = styled.div`
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  margin: 20px 0;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AlertTitle = styled.h3`
  color: var(--text-primary);
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const AlertForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 120px;
  
  @media (max-width: 480px) {
    min-width: 100%;
  }
`;

const Label = styled.label`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--surface-hover);
  color: var(--text-primary);
  font-size: 16px;
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--border-hover);
    box-shadow: 0 0 0 3px rgba(33, 206, 153, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--surface-hover);
  color: var(--text-primary);
  font-size: 16px;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--border-hover);
    box-shadow: 0 0 0 3px rgba(33, 206, 153, 0.1);
  }
  
  option {
    background: var(--surface-hover);
    color: var(--text-primary);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius-md);
  background: var(--primary-color);
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  
  &:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:disabled {
    background: var(--text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AlertList = styled.div`
  margin-top: 20px;
`;

const AlertItem = styled.div`
  background: #404042;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid ${props => props.status === ALERT_STATUS.TRIGGERED ? '#21ce99' : '#555'};
`;

const AlertItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const AlertCoin = styled.span`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const AlertStatus = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case ALERT_STATUS.ACTIVE: return '#21ce99';
      case ALERT_STATUS.TRIGGERED: return '#ff6b35';
      case ALERT_STATUS.DISMISSED: return '#666';
      default: return '#555';
    }
  }};
  color: white;
`;

const AlertDetails = styled.div`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 8px;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #d82d2d;
  border-radius: 4px;
  background: transparent;
  color: #d82d2d;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #d82d2d;
    color: white;
  }
`;

const ErrorMessage = styled.div`
  color: #d82d2d;
  font-size: 14px;
  margin-top: 8px;
`;

const SuccessMessage = styled.div`
  color: #21ce99;
  font-size: 14px;
  margin-top: 8px;
`;

const PriceAlert = ({ coinSymbol, currentPrice, currency = 'USD' }) => {
  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    targetPrice: '',
    alertType: ALERT_TYPE.ABOVE
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load alerts on component mount
  useEffect(() => {
    loadAlertsForCoin();
  }, [loadAlertsForCoin]);

  const loadAlertsForCoin = useCallback(async () => {
    try {
      const allAlerts = await loadAlerts();
      const coinAlerts = getAlertsForCoin(allAlerts, coinSymbol);
      setAlerts(coinAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
      setError('Failed to load alerts');
    }
  }, [coinSymbol]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const alertData = {
        coinSymbol,
        targetPrice: formData.targetPrice,
        alertType: formData.alertType,
        currency
      };

      // Validate alert data
      const validation = validateAlert(alertData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Check for duplicate alerts
      const existingAlert = alerts.find(alert =>
        alert.targetPrice === parseFloat(formData.targetPrice) &&
        alert.alertType === formData.alertType &&
        alert.status === ALERT_STATUS.ACTIVE
      );

      if (existingAlert) {
        setError('An identical alert already exists for this coin');
        return;
      }

      // Create and add alert
      const newAlert = createAlert(
        alertData.coinSymbol,
        alertData.targetPrice,
        alertData.alertType,
        alertData.currency
      );

      await addAlert(newAlert);
      await loadAlertsForCoin();

      setFormData({
        targetPrice: '',
        alertType: ALERT_TYPE.ABOVE
      });
      setSuccess('Alert created successfully!');
    } catch (error) {
      console.error('Failed to create alert:', error);
      setError('Failed to create alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = useCallback(async (alertId) => {
    try {
      await removeAlert(alertId);
      await loadAlertsForCoin();
      setSuccess('Alert deleted successfully!');
    } catch (error) {
      console.error('Failed to delete alert:', error);
      setError('Failed to delete alert. Please try again.');
    }
  }, [loadAlertsForCoin]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  }, [currency]);

  const getStatusText = useCallback((status) => {
    switch (status) {
      case ALERT_STATUS.ACTIVE: return 'Active';
      case ALERT_STATUS.TRIGGERED: return 'Triggered';
      case ALERT_STATUS.DISMISSED: return 'Dismissed';
      default: return 'Unknown';
    }
  }, []);

  // Memoized alert list to prevent unnecessary re-renders
  const alertList = useMemo(() => {
    if (alerts.length === 0) return null;

    return (
      <AlertList>
        <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Your Alerts</h4>
        {alerts.map(alert => (
          <AlertItem key={alert.id} status={alert.status}>
            <AlertItemHeader>
              <AlertCoin>{alert.coinSymbol}</AlertCoin>
              <AlertStatus status={alert.status}>
                {getStatusText(alert.status)}
              </AlertStatus>
            </AlertItemHeader>
            <AlertDetails>
              Alert when price goes {alert.alertType} {formatPrice(alert.targetPrice)}
            </AlertDetails>
            <AlertDetails>
              Created: {new Date(alert.createdAt).toLocaleDateString()}
              {alert.triggeredAt && (
                <span> • Triggered: {new Date(alert.triggeredAt).toLocaleDateString()}</span>
              )}
            </AlertDetails>
            <AlertActions>
              <DeleteButton onClick={() => handleDeleteAlert(alert.id)}>
                Delete
              </DeleteButton>
            </AlertActions>
          </AlertItem>
        ))}
      </AlertList>
    );
  }, [alerts, getStatusText, formatPrice, handleDeleteAlert]);

  return (
    <AlertContainer>
      <AlertHeader>
        <AlertTitle>Price Alerts for {coinSymbol?.toUpperCase()}</AlertTitle>
        {currentPrice && (
          <div style={{ color: '#aaa', fontSize: '14px' }}>
            Current Price: {formatPrice(currentPrice)}
          </div>
        )}
      </AlertHeader>

      <AlertForm onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <Label>Target Price ({currency})</Label>
            <Input
              type="number"
              name="targetPrice"
              value={formData.targetPrice}
              onChange={handleInputChange}
              placeholder="Enter target price"
              step="0.00000001"
              min="0"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Alert When Price Goes</Label>
            <Select
              name="alertType"
              value={formData.alertType}
              onChange={handleInputChange}
            >
              <option value={ALERT_TYPE.ABOVE}>Above</option>
              <option value={ALERT_TYPE.BELOW}>Below</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Alert'}
            </Button>
          </FormGroup>
        </FormRow>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </AlertForm>

      {alertList}
    </AlertContainer>
  );
};

// PropTypes for type checking
PriceAlert.propTypes = {
  coinSymbol: PropTypes.string.isRequired,
  currentPrice: PropTypes.number,
  currency: PropTypes.string
};

PriceAlert.defaultProps = {
  currentPrice: 0,
  currency: 'USD'
};

export default PriceAlert;

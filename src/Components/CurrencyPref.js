import React, { Component } from 'react';
import { $currencySymbol } from '../Utils/Helpers';
import { translationStrings } from '../Utils/i18n';
import styled from 'styled-components';

const PrefWrapper = styled.div`
  display: flex;
  margin: 10px auto;
  padding: 0px 10px;
  max-width: 1100px;
`;
const Title = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-right: 12px;
`;

const Selector = styled.div`
  display: flex;
  margin: auto 0px;
  margin-left: auto;
`;

class CurrencyPref extends Component {

  handleSelectChange = (e) => {
    const domElement = e.target.id;
    const newCurrencyPref = e.target.value;
    const currentCurrencyPref = this.props.currency;

    this.props.saveNewPref("currency", newCurrencyPref);
  }

  render() {
    const curSymbol = $currencySymbol(this.props.currency);
    const selectCurrency = this.props.supportedCurrencies.map((cur) => {
      return <option key={cur[0]} value={cur[0].toUpperCase()}>{cur[0].toUpperCase()} {cur[1]}</option>
    });
    const string = translationStrings(this.props.language);
    return (
      <PrefWrapper>
        <Title>{string.currencypref}</Title>
        <Selector>
          <select
            id="currency"
            onChange={this.handleSelectChange}
            value={this.props.currency}
            name="select"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #444',
              background: '#2a2a2a',
              color: '#ffffff',
              fontSize: '12px',
              minWidth: '120px'
            }}
          >
            {selectCurrency}
          </select>
        </Selector>
      </PrefWrapper>
    );
  }
}

export default CurrencyPref;

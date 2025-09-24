import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { translationStrings } from '../Utils/i18n';
import fetch from "fetch-retry";
import styled from 'styled-components';
import PageLayout from '../Components/PageLayout';

const SupportedCoinsList = styled.ul`
  background: #303032;
  margin-top: 0px;
  list-style: none;
  padding: 65px 20px 0px 20px;
`;
const SupportedCoinItem = styled.li`
  border-bottom: 1px solid hsla(0,0%,100%,.1);
  color: white;
  padding: 10px 0;
`;

class SupportedCoins extends Component {

  constructor(props) {
    super(props);
    this.state = {
      supported: []
    }
  }

  componentWillMount() {
    fetch("https://api.coingecko.com/api/v3/coins/list")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(coins => {
        this.setState({
          supported: coins.map(c => ({
            "code": c.symbol,
            "name": c.name,
            "statuses": ["primary"]
          }))
        })
      })
      .catch((e) => {
        console.warn('Failed to load supported coins', e);
        this.setState({ supported: [] });
      })

  }

  render() {
    console.log(this.state.supported, 'where coisn');

    return (
      <PageLayout
        title="Supported Coins"
        currentPath="/supportedcoins"
        blockstack={this.props.blockstack}
        supportedCurrencies={this.props.supportedCurrencies}
        saveNewPref={this.props.saveNewPref}
        language={this.props.language}
        currency={this.props.currency}
        addCoinz={this.props.addCoinz}
      >
        <SupportedCoinsList>
          {this.state.supported.map((coin, index) => (
            <SupportedCoinItem key={index}>
              {coin.name} ({coin.code})
            </SupportedCoinItem>
          ))}
        </SupportedCoinsList>
      </PageLayout>
    );
  }
}

export default SupportedCoins;

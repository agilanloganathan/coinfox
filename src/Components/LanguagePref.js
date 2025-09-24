import React, { Component } from 'react';
import { $currencySymbol } from '../Utils/Helpers';
import { translationStrings } from '../Utils/i18n';
import styled from 'styled-components';
import { supportedLanguages, languageName } from '../Utils/i18n'

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

class LanguagePref extends Component {

  handleSelectChange = (e) => {
    const domElement = e.target.id;
    const newLanguagePref = e.target.value;
    const currentLanguagePref = this.props.language;

    this.props.saveNewPref("language", newLanguagePref);
  }

  render() {
    const selectLanguage = supportedLanguages.map((lang) => {
      return <option key={lang} value={lang.toUpperCase()}>{languageName[lang]}</option>
    });
    const string = translationStrings(this.props.language);
    return (
      <PrefWrapper>
        <Title>{string.languagepref}</Title>
        <Selector>
          <select
            id="language"
            onChange={this.handleSelectChange}
            value={this.props.language || ''}
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
            {selectLanguage}
          </select>
        </Selector>
      </PrefWrapper>
    );
  }
}

export default LanguagePref;

import React, { Component } from 'react';
import { translationStrings } from '../Utils/i18n';


class ImportExport extends Component {
  constructor() {
    super();
    this.state = {
      importUrl: "Add coins or paste import link"
    };
    this._getLink = this._getLink.bind(this);
    this._importString = this._importString.bind(this);
  }

  _getLink() {
    if (localStorage.coinz) {
      const base64 = btoa(JSON.stringify(localStorage));
      this.setState({ importUrl: window.location.origin + "?import=" + base64 });
    }
  }

  _importString() {
    const base64 = this.state.importString;
    console.log(this.state.importString)
    const json = atob(base64.split("import=")[1]);
    const data = JSON.parse(json);
    Object.keys(data).forEach((key) => {
      localStorage.setItem(key, data[key]);
    });
    window.location.reload();
  }

  render() {
    const string = translationStrings(this.props.language);
    return (
      <div style={{ padding: '16px 0' }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#ffffff',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          {string.importexport}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#cccccc',
          marginBottom: '12px',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          {string.copylink}
        </div>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({ importString: e.target.value })}
            defaultValue={this.state.importUrl}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #444',
              background: '#2a2a2a',
              color: '#ffffff',
              fontSize: '12px'
            }}
          />
        </div>
        {!localStorage.coinz ? (
          <button
            onClick={this._importString}
            style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #21ce99',
              background: '#21ce99',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Import
          </button>
        ) : null}
      </div>
    );
  }
}

export default ImportExport;

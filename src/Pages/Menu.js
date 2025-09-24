import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class Menu extends Component {
  render() {
    // Redirect to home since sidebar is now integrated in PageLayout
    const home = this.props.blockstack ? '/blockstack' : '/';
    return <Navigate to={home} replace />;
  }
}

export default Menu;
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import './NewPrincipal.css';

class NewPrincipal extends Component {
  render() {
    return (
      <div>
     New principal
      </div>
    );
  }
}

export default withRouter(NewPrincipal);

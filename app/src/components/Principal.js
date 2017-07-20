import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import './Principal.css';

const utils = require('./../utils.js');
class Principal extends Component {

  componentWillMount() {
    if (!utils.IsRoot()) {
      this.props.history.push('/');
    }

    console.log(this, utils.IsRoot());

  }

  render() {
    return (
      <div>
     principal
      </div>
    );
  }
}

export default withRouter(Principal);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './Login.css';

const config = require('./../config.json');

class Login extends Component {
  constructor(props) {
    super(props);
  }

  handleLogin(e) {
    console.log(e, "asd");
  }

  render() {
    return (
      <form className="loginForm">
        <TextField floatingLabelText="Username" fullWidth={true} />
        <TextField floatingLabelText="Password" fullWidth={true} />
        <RaisedButton label="Login" fullWidth={true} onTouchTap={this.handleLogin} />
      </form>
    );
  }
}

export default withRouter(Login);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './Login.css';

const config = require('./../config.json');
const _ = require('lodash/core');
const loginErr = new Error('Invalid email or password');



class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }

  _login() {
    var params = new URLSearchParams();
    params.append('email', this.state.email);
    params.append('password', this.state.password);

    return axios.post(config.baseURL + '/login', params);
  }

  _getMe(res) {
    return axios.get(config.baseAPI_URL + '/user/me');
  }

  _getRole(res) {
    localStorage.setItem('alantu-user', JSON.stringify(res.data));

    return axios.get(config.baseAPI_URL + '/role/' + res.data.role_id);
  }

  _handleRole(res) {
    localStorage.setItem('alantu-role', JSON.stringify(res.data));
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _handleLogin(e) {
    if (_.isEmpty(this.state) || 
      this.state.password === undefined ||
      this.state.email === undefined) {

      setTimeout(function() {
        this.setState({ error: null });
      }.bind(this), 5000);
      return;
    }

    this._login()
    .then(this._getMe)
    .then(this._getRole)
    .then(this._handleRole)
    .catch(err => {
      this.setState({ error: loginErr });
    });
  }

  render() {
    return (
      <div>
        <ErrorReporting open={this.state.error !== null}
                  error={this.state.error} />
        <form className="loginForm">
          <TextField floatingLabelText="Username" 
                    data-val="email"
                    onChange={this._handleTextFieldChange.bind(this)} 
                    fullWidth={true} />
          <TextField floatingLabelText="Password"
                    data-val="password"
                    onChange={this._handleTextFieldChange.bind(this)} 
                    fullWidth={true} />
          <RaisedButton label="Login" fullWidth={true} onTouchTap={this._handleLogin.bind(this)} />
        </form>
      </div>
    );
  }
}

export default withRouter(Login);

import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ErrorReporting from 'material-ui-error-reporting';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import './Register.css';

const config = require('./../config.json');
const _ = require('lodash/core');

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }

  _createPrincipal() {
    var principalParams = new URLSearchParams();
    principalParams.append('name', this.state.username);

    return axios.post(config.baseAPI_URL + '/principal', principalParams);
  }

  _createUser(res) {
    var principal = res.data;
    var userParams = new URLSearchParams();
    var date = new Date().toISOString().split('T')[0];
    userParams.append('principal_id', principal.id);
    userParams.append('role_id', config.roles.manager.id);
    userParams.append('email', this.state.email);
    userParams.append('password', this.state.password);
    userParams.append('username', this.state.username);
    userParams.append('created_at', date);
    userParams.append('updated_at', date);

    return axios.post(config.baseAPI_URL + '/user', userParams);
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _handleRegister(e) {
    if (_.isEmpty(this.state) || 
      !this.refs.checkbox.state.switched ||
      this.state.username == undefined ||
      this.state.password == undefined ||
      this.state.email === undefined ||
      this.state.password !== this.state.passwordConfirmation) {

      this._handleError();
      return;
    }

    this._createPrincipal()
    .then(this._createUser.bind(this))
    .then(function(res) {
      this.props.history.push('/' + config.roles.manager.name);
    }.bind(this))
    .catch(function(err) {
      this._handleError();
    }.bind(this));
  }

  _handleError() {
    this.setState({
      error: new Error('Invalid data')
    });

    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);
  }

  render() {
    return (
      <div>
        <ErrorReporting open={this.state.error !== null}
                        error={this.state.error} />
        <form className="registerForm">
          <TextField floatingLabelText="Username" 
                     data-val="username"
                     onChange={this._handleTextFieldChange.bind(this)} 
                     fullWidth={true} />
          <TextField floatingLabelText="Email" 
                     data-val="email" 
                     onChange={this._handleTextFieldChange.bind(this)} 
                     fullWidth={true} />
          <TextField floatingLabelText="Password" 
                     data-val="password" 
                     onChange={this._handleTextFieldChange.bind(this)} 
                     fullWidth={true} />
          <TextField floatingLabelText="Password confirmation" 
                     data-val="passwordConfirmation" 
                     onChange={this._handleTextFieldChange.bind(this)} 
                     fullWidth={true} />
          <div className="verticalMargin leftMargin">
            <Checkbox ref="checkbox" label={(
              "I accept the <a to='/terms'>Terms</a>  and Data Protection Policy of vVents LLC"
            )}/>
          </div>
          <div className="verticalMargin">
            <RaisedButton label="Register" fullWidth={true} onTouchTap={this._handleRegister.bind(this)} />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Register);

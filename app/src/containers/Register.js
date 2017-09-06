import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { grey500, white, blue700, blue500 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ThemeDefault from '../theme-default';
import Paper from 'material-ui/Paper';
import ErrorReporting from 'material-ui-error-reporting';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import './Register.css';

const config = require('./../config.json');
const moment = require('moment');
const _ = require('lodash/core');
const styles = {
  paper: {
    padding: 20,
    overflow: 'auto'
  },
  alignCenter: {
    textAlign: 'center'
  },
  link: {
    color: blue500
  },
  login: {
    color: blue700,
    fontWeight: 900
  },
  logo: {
    width: '28%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundImage: 'url("/background-register.jpg")',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  }
};

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
    principalParams.append('created_at', moment().utc(new Date()).format());
    principalParams.append('enabled', true);

    return axios.post(config.baseAPI_URL + '/principal', principalParams);
  }

  _createUser(res) {
    var principal = res.data;
    var userParams = new URLSearchParams();
    var date = moment(new Date()).utc().format();
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
      this.state.username === undefined ||
      this.state.password === undefined ||
      this.state.email === undefined ||
      this.state.password !== this.state.passwordConfirmation) {

      this._handleError();
      return;
    }

    this._createPrincipal()
    .then(this._createUser.bind(this))
    .then(function(res) {
      this.props.history.push('/login');
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
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div style={styles.background}>
          <ErrorReporting open={this.state.error !== null}
                          error={this.state.error} />
          <div className="register-container">
            <Paper style={styles.paper}>
              <form>
                <img style={styles.logo} src="/logo.png" alt="logo"/>
                <TextField floatingLabelText="Username"
                          data-val="username"
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
                <TextField floatingLabelText="Email"
                          data-val="email"
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
                <TextField floatingLabelText="Password"
                          type="password"
                          data-val="password"
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
                <TextField floatingLabelText="Password confirmation"
                          type="password"
                          data-val="passwordConfirmation"
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
                <div className="checkbox-container">
                  <Checkbox ref="checkbox"/>
                  <span>I accept the
                    <a style={styles.link} href='/terms'> Terms</a> and
                    <a style={styles.link} href='/privacy_policy'> Data Protection Policy</a> of vVents LLC
                  </span>
                </div>
                <div style={styles.alignCenter}>
                  <RaisedButton label="Register" primary={true} onTouchTap={this._handleRegister.bind(this)} />
                  <p>Already have an account? <a style={styles.login} href="/login">Sign in</a></p>
                </div>
              </form>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Register);

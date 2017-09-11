import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { grey500, white, blue700, blue500 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import ErrorReporting from 'material-ui-error-reporting';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Help from 'material-ui/svg-icons/action/help';
import ThemeDefault from '../theme-default';
import UnauthenticatedHeader from './../components/header/UnauthenticatedHeader';
import FbLogin from './FbLogin';
import axios from 'axios';

const config = require('./../config.json');
const utils = require('./../utils.js');
const _ = require('lodash/core');
const loginErr = new Error('Invalid email or password');

const styles = {
  loginContainer: {
    minWidth: 320,
    maxWidth: 400,
    height: 'auto',
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    margin: 'auto'
  },
  paper: {
    padding: 20,
    overflow: 'auto'
  },
  forgotPassword: {
    display: 'block',
    marginTop: 10,
    color: grey500
  },
  signUp: {
    color: blue700,
    fontWeight: 900
  },
  loginBtn: {
    marginTop: 35,
    marginBottom: 20,
    color: blue500
  },
  alignCenter: {
    textAlign: 'center'
  },
  alignRight: {
    textAlign: 'right'
  },
  btn: {
    background: '#4f81e9',
    color: white,
    padding: 7,
    borderRadius: 2,
    margin: 2,
    fontSize: 13
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
    backgroundImage: 'url("/background-login.jpg")',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  }
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }

  componentDidMount() {
    utils.setBackground();
    utils.setLogo();
  }

  handleResponse = (data) => {
    console.log(data);
  }
 
  handleError = (error) => {
    this.setState({ error });
  }

  _login() {
    var params = new URLSearchParams();
    params.append('email', this.state.email);
    params.append('password', this.state.password);

    return axios.post(config.baseURL + '/login', params);
  }

  _getMe(res) {
    localStorage.setItem('token', res.data.token);
    return axios.get(config.baseAPI_URL + '/user/me');
  }

  _getRole(res) {
    localStorage.setItem('alantu-user', JSON.stringify(res.data));

    return axios.get(config.baseAPI_URL + '/role/' + res.data.role_id);
  }

  _handleRole(res) {
    localStorage.setItem('alantu-role', JSON.stringify(res.data));

    switch (res.data.name) {
      case config.roles.root.name:
        this.props.history.push('/root/');
        break;
      case config.roles.manager.name:
        this.props.history.push('/manager/');
        break;
      case config.roles.user.name:
        this.props.history.push('/user/');
        break;
      default:
        this.props.history.push('/');
        break;
    }
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

      setTimeout(function () {
        this.setState({ error: null });
      }.bind(this), 5000);
      return;
    }

    this._login()
      .then(this._getMe.bind(this))
      .then(this._getRole.bind(this))
      .then(this._handleRole.bind(this))
      .catch(err => {
        this.setState({ error: loginErr });
      });
  }

  render() {

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <UnauthenticatedHeader />

          <div style={styles.background}>
            <div style={styles.loginContainer}>
              <Paper style={styles.paper}>
                <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />
                <form>
                  <img style={styles.logo} src="/logo.png" alt="logo"/>
                  <TextField floatingLabelText="Email or username"
                    data-val="email"
                    onChange={this._handleTextFieldChange.bind(this)}
                    fullWidth={true} />
                  <TextField floatingLabelText="Password"
                    type="password"
                    data-val="password"
                    onChange={this._handleTextFieldChange.bind(this)}
                    fullWidth={true} />
                  <div style={styles.alignRight}>
                    <a style={styles.forgotPassword} href="/forgot_password">Forgot password?</a>
                  </div>
                  <div style={styles.alignCenter}>
                    <RaisedButton label="Login"
                      onTouchTap={this._handleLogin.bind(this)}
                      primary={true}
                      style={styles.loginBtn} />
                    <p>Don't you have an account? <a style={styles.signUp} href="/register">Sign Up</a></p>
                  </div>

                  <div style={{marginTop: '40px', textAlign: 'center'}}>
                    <p style={{marginBottom: '25px'}}>- or -</p>
                    <FbLogin />
                  </div>
                </form>
              </Paper>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Login);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { grey500, white } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import ErrorReporting from 'material-ui-error-reporting';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Help from 'material-ui/svg-icons/action/help';
import ThemeDefault from '../theme-default';
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
  buttonsDiv: {
    textAlign: 'center',
    padding: 10
  },
  flatButton: {
    color: grey500
  },
  checkRemember: {
    style: {
      float: 'left',
      maxWidth: 180,
      paddingTop: 5
    },
    labelStyle: {
      color: grey500
    },
    iconStyle: {
      color: grey500,
      borderColor: grey500,
      fill: grey500
    }
  },
  loginBtn: {
    float: 'right'
  },
  btn: {
    background: '#4f81e9',
    color: white,
    padding: 7,
    borderRadius: 2,
    margin: 2,
    fontSize: 13
  },
  btnFacebook: {
    background: '#4f81e9'
  },
  btnGoogle: {
    background: '#e14441'
  },
  btnSpan: {
    marginLeft: 5
  },
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
          <div style={styles.loginContainer}>

            <Paper style={styles.paper}>
              <ErrorReporting open={this.state.error !== null}
                  error={this.state.error} />
              <form>
                <TextField floatingLabelText="Username"
                  data-val="email"
                  onChange={this._handleTextFieldChange.bind(this)}
                  fullWidth={true} />
                <TextField floatingLabelText="Password"
                  data-val="password"
                  onChange={this._handleTextFieldChange.bind(this)}
                  fullWidth={true} />
                <div>
                  <Checkbox
                    label="Remember me"
                    style={styles.checkRemember.style}
                    labelStyle={styles.checkRemember.labelStyle}
                    iconStyle={styles.checkRemember.iconStyle}
                  />

                  <RaisedButton label="Login"
                    onTouchTap={this._handleLogin.bind(this)}
                    primary={true}
                    style={styles.loginBtn} />
                </div>
              </form>
            </Paper>

            <div style={styles.buttonsDiv}>
              <FlatButton
                label="Register"
                href="/register"
                style={styles.flatButton}
                icon={<PersonAdd />}
              />

              <FlatButton
                label="Forgot Password?"
                href="/forgot"
                style={styles.flatButton}
                icon={<Help />}
              />
            </div>

            <div style={styles.buttonsDiv}>
              <Link to="/" style={{ ...styles.btn, ...styles.btnFacebook }}>
                <i className="fa fa-facebook fa-lg" />
                <span style={styles.btnSpan}>Log in with Facebook</span>
              </Link>
              <Link to="/" style={{ ...styles.btn, ...styles.btnGoogle }}>
                <i className="fa fa-google-plus fa-lg" />
                <span style={styles.btnSpan}>Log in with Google</span>
              </Link>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Login);

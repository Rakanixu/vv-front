import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import axios from 'axios';
import { setBackground, setLogo, setPrimaryColor } from '../../utils';
import './UnauthenticatedHeader.css'

const config = require('../../config.json');
let principal = {};

class UnauthenticatedHeader extends Component {
  constructor(props) {
    super(props);

    this.state = { open: true };
  }

  componentWillMount() {
    axios.get(config.baseAPI_URL + '/principal/me').then(function(res) {
      principal = res.data[0];
      setBackground(config.baseURL + principal.background);
      setLogo(config.baseURL + principal.logo);
      setPrimaryColor(principal.primary_color);
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));;
  }

  _handleToggle = (e) => {
    this.setState({ open: !this.state.open });
  }

  _handleRedirect(e) {
    this.props.history.push(e.currentTarget.dataset.url);
    this.setState({ open: false });
  }

  _handleError(err) {
    if (!err) {
      err = new Error('Invalid data');
    }

    this.setState({
      error: err
    });

    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);
  }

  render() {
    const styles = {
      header: {
        paddigBottom: 70,
        position: 'fixed',
        top: 0,
        overflow: 'hidden',
        maxHeight: 57
      }
    };

    return (
      <div>
        <AppBar style={styles.header}
                showMenuIconButton={false}
                children={
                  <div>
                    <div className="logo-container">
                      <a href="/">
                        <img id="principalLogo" src=""/>
                      </a>
                    </div>
                    <div className="unauthenticated-right-header-container">
                      <a href="/login">Login</a>
                      <a href="/register">Don't you have an account?</a>
                    </div>
                  </div>
                } />

                <div className="unauthenticated-container">
          </div>      
      </div>
    );
  }
}

export default withRouter(UnauthenticatedHeader);

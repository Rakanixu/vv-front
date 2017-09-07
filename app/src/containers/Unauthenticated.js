import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import ThemeDefault from '../theme-default';
import EventsGridList from '../components/event/EventsGridList';
import axios from 'axios';
import { setBackground, setLogo, setPrimaryColor } from '../utils';
import './Unauthenticated.css'

const config = require('./../config.json');
const utils = require('../utils.js');
let principal = {};

class Unauthenticated extends Component {
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
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>

          <AppBar style={styles.header}
                  showMenuIconButton={false}
                  children={
                    <div className="logo-container">
                      <img id="principalLogo" src=""/>
                    </div>
                  } />

          <div className="unauthenticated-container">
            <EventsGridList isTemplate={false} authenticated={false}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Unauthenticated);

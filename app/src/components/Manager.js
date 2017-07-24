import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Events from './Events';
import NewEvent from './NewEvent';
import NewEventWrapper from './NewEventWrapper';
import EventsGridList from './EventsGridList';
import Event from './Event';
import Media from './Media';
import NewMedia from './NewMedia';
import DesignOptions from './DesignOptions';
import axios from 'axios';
import './Manager.css';

const config = require('./../config.json');
const utils = require('./../utils.js');
var user, principal = {};

class Manager extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      open: false,
      url: config.baseAPI_URL + '/principal',
    };
  }

  componentWillMount() {
    if (!utils.IsManager()) {
      this.props.history.push('/');
    }

    if (localStorage.getItem('alantu-user')) {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }

    this._getPrincipal(user.principal_id);
  }

  _getPrincipal = (id) => {
    axios.get(this.state.url + '/' + id).then(res => {
      principal = res.data;
      utils.setBackground(config.baseURL + principal.background);
      utils.setLogo(config.baseURL + principal.logo);
    }).catch(err => {
      this._handleError(err);
    });
  }

  _handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  _handleRedirect(e) {
    this.props.history.push(e.currentTarget.dataset.url);
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <AppBar title="Manager" 
                iconElementRight={<FlatButton label="Logout" />} 
                onTouchTap={this._handleToggle}/>
        <Drawer open={this.state.open}>
          <div className="logo-container"><img id="principalLogo" className="logo" src="/logo.png"/></div>
          <MenuItem data-url="/manager/event" onTouchTap={this._handleRedirect.bind(this)}>Events overview</MenuItem>
          <MenuItem data-url="/manager/event/new" onTouchTap={this._handleRedirect.bind(this)}>New event</MenuItem>
          <MenuItem data-url="/manager/event_location" onTouchTap={this._handleRedirect.bind(this)}>Event locations</MenuItem>        
          <MenuItem data-url="/manager/donations" onTouchTap={this._handleRedirect.bind(this)}>Donations</MenuItem>        
          <MenuItem data-url="/manager/users" onTouchTap={this._handleRedirect.bind(this)}>Users</MenuItem>
          <MenuItem data-url="/manager/media" onTouchTap={this._handleRedirect.bind(this)}>Media</MenuItem>      
          <MenuItem data-url="/manager/design_options" onTouchTap={this._handleRedirect.bind(this)}>Design options</MenuItem>        
        </Drawer>
        <div className="manager-container">
          <Switch>
            <Route exact path={`${this.props.match.path}`} component={EventsGridList} />
            <Route exact path={`${this.props.match.path}/event`} component={EventsGridList} />
            <Route exact path={`${this.props.match.path}/event/new`} component={NewEventWrapper} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId`} component={Event} />
            <Route exact path={`${this.props.match.path}/media`} component={Media} />
            <Route exact path={`${this.props.match.path}/media/new`} component={NewMedia} />
            <Route exact path={`${this.props.match.path}/design_options`} component={DesignOptions} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(Manager);

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
import './Manager.css';

const utils = require('./../utils.js');

class Manager extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  componentWillMount() {
    if (!utils.IsManager()) {
      this.props.history.push('/');
    }
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
          <div><img className="logo" src="/logo.png"/></div>
          <MenuItem data-url="/manager/event" onTouchTap={this._handleRedirect.bind(this)}>Events overview</MenuItem>
          <MenuItem data-url="/manager/event/new" onTouchTap={this._handleRedirect.bind(this)}>New event</MenuItem>
          <MenuItem data-url="/manager/event_location" onTouchTap={this._handleRedirect.bind(this)}>Event locations</MenuItem>        
          <MenuItem data-url="/manager/donations" onTouchTap={this._handleRedirect.bind(this)}>Donations</MenuItem>        
          <MenuItem data-url="/manager/users" onTouchTap={this._handleRedirect.bind(this)}>Users</MenuItem>        
          <MenuItem data-url="/manager/design_options" onTouchTap={this._handleRedirect.bind(this)}>Design options</MenuItem>        
        </Drawer>
        <Switch>
          <Route exact path={`${this.props.match.path}`} component={EventsGridList} />
          <Route exact path={`${this.props.match.path}/event`} component={EventsGridList} />
          <Route exact path={`${this.props.match.path}/event/new`} component={NewEventWrapper} />
          <Route exact path={`${this.props.match.path}/event/edit/:eventId`} component={Event} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Manager);

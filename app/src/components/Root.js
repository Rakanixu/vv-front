import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Nav from './Nav';
import Principal from './Principal';
import NewPrincipal from './NewPrincipal';
import EditPrincipal from './EditPrincipal';
import './Root.css';

const utils = require('./../utils.js');

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  componentWillMount() {
    if (!utils.IsRoot()) {
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
        <AppBar title="Principals" iconClassNameRight="muidocs-icon-navigation-expand-more" onTouchTap={this._handleToggle}/>
        <Drawer open={this.state.open}>
          <div><img className="logo" src="/logo.png"/></div>
          <MenuItem data-url="/root/principal/new" onTouchTap={this._handleRedirect.bind(this)}>New principal</MenuItem>
          <MenuItem data-url="/root/principal" onTouchTap={this._handleRedirect.bind(this)}>Overview</MenuItem>
        </Drawer>
        <Switch>
          <Route exact path={`${this.props.match.path}`} component={Principal} />
          <Route exact path={`${this.props.match.path}/principal`} component={Principal} />
          <Route exact path={`${this.props.match.path}/principal/new`} component={NewPrincipal} />
          <Route exact path={`${this.props.match.path}/principal/edit/:principalId`} component={EditPrincipal} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Root);

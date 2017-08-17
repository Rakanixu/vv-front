import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import Header from '../components/header/Header';
import LeftBar from '../components/leftbar/LeftBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Principal from '../components/principal/Principal';
import NewPrincipal from '../components/principal/NewPrincipal';
import EditPrincipal from '../components/principal/EditPrincipal';
import ThemeDefault from '../theme-default';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import Assessment from 'material-ui/svg-icons/action/assessment';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import ImageExposurePlus1 from 'material-ui/svg-icons/image/exposure-plus-1';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';
import Web from 'material-ui/svg-icons/av/web';


const utils = require('../utils.js');

const data = {
  menus: [
    { text: 'Overview', icon: <Assessment />, link: '/root/principal' },
    { text: 'Pass events', icon: <Web />, link: '/form' },
    { text: 'Table Page', icon: <GridOn />, link: '/root/principal' },
    { text: 'New Principal', icon: <ImageExposurePlus1 />, link: '/root/principal/new' },
    { text: 'Login Page', icon: <PermIdentity />, link: '/login' }
  ],
}



class Root extends Component {
  constructor(props) {
    super(props);

    this.state = { open: true };
  }

  componentWillMount() {
    if (!utils.IsRoot()) {
      this.props.history.push('/');
    }
  }

  componentDidMount() {
    if (JSON.parse(localStorage.getItem('alantu-user'))) {
      //this.refs.img.src = JSON.parse(localStorage.getItem('alantu-user')).avatar;
    }
  }

  _handleToggle = (e) => {
    this.setState({ open: !this.state.open });
  }

  _handleClose = () => {
    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  _logout = (e) => {
    localStorage.clear();
    this.props.history.push('/login');
  }

  _handleRedirect(e) {
    this.props.history.push(e.currentTarget.dataset.url);
    this.setState({ open: false });
  }

  render() {
    const paddingLeftDrawerOpen = 340;
    const styles = {
      header: {
        paddingLeft: this.state.open ? paddingLeftDrawerOpen : 0
      },
      container: {
        margin: '120px 20px 20px 15px',
        paddingLeft: this.state.open && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
      }
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <Header styles={styles.header}
            handleChangeRequestNavDrawer={this._handleToggle.bind(this)} />
          <LeftBar navDrawerOpen={this.state.open}
            menus={data.menus}
            username="User" />
          <div style={styles.container}>
            <Switch>
              <Route exact path={`${this.props.match.path}`} component={Principal} />
              <Route exact path={`${this.props.match.path}/principal`} component={Principal} />
              <Route exact path={`${this.props.match.path}/principal/new`} component={NewPrincipal} />
              <Route exact path={`${this.props.match.path}/principal/edit/:principalId`} component={EditPrincipal} />
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Root);

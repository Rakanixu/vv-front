import React, {PropTypes} from 'react';
import {Link} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ArrowDown from 'material-ui/svg-icons/navigation/expand-more';
import Menu from 'material-ui/svg-icons/navigation/menu';
import {Tabs, Tab} from 'material-ui/Tabs';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Avatar from 'material-ui/Avatar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RaisedButton from 'material-ui/RaisedButton';
import ViewModule from 'material-ui/svg-icons/action/view-module';
import {grey900} from 'material-ui/styles/colors';
import SearchBar from 'material-ui-search-bar';
import SearchBox from './SearchBox';

import './Header.css';

class Header extends React.Component {

  render() {
    const {styles, handleChangeRequestNavDrawer} = this.props;

    const style = {
      appBar: {
        position: 'fixed',
        top: 0,
        overflow: 'hidden',
        maxHeight: 57,
      },
      menuButton: {
        marginLeft: 10
      },
      iconsRightContainer: {
        marginLeft: 20,
        marginTop: -8
      },
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
      tabs: {
        width: 600,
        height: 55,
      },
      inkBarStyle: {
        height: 5,
        background: '#2196F3'
      },
      tabItemContainerStyle: {
        height: 54,
        background: '#ffffff'
      },
      text: {
        fontSize: 15
      },
      tab: {
        textTransform: 'none'
      },
      button: {
        marginLeft:10
      },
      userMenu: {
        position: 'absolute',
        boxShadow: 'none',
        padding: 0,
        top: 10,
        right: 0
      }
    };

    return (
        <div>
            <AppBar
              style={{...styles, ...style.appBar}}
              showMenuIconButton={false}
              iconElementLeft={
                <IconButton style={style.menuButton} onClick={handleChangeRequestNavDrawer}>
                  <Menu color={grey900} />
                </IconButton>
              }
              children={
                <div className="header-full-bar-left">
                  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <Tabs
                        inkBarStyle={style.inkBarStyle}
                        tabItemContainerStyle={style.tabItemContainerStyle}
                        style={style.tabs}>
                      <Tab
                          style={style.tab}
                          label="Cockpit" />
                      <Tab
                          style={style.tab}
                          label="Events" />
                      <Tab
                          style={style.tab}
                          label="Users" />
                      <Tab
                          style={style.tab}
                          label="Donations" />
                      <Tab
                          style={style.tab}
                          label="Shop" />
                      <Tab
                          style={style.tab}
                          label="Resources" />
                    </Tabs>
                  </MuiThemeProvider>
                  <FloatingActionButton
                      mini={true}
                      backgroundColor="#2196F3"
                      zDepth={0}
                      style={style.button}>
                    <ContentAdd />
                  </FloatingActionButton>
                </div>
              }
              iconElementRight={
                <div className="header-bar-right">
                  {/* <IconMenu color={grey900}
                            iconButtonElement={
                              <IconButton><ViewModule color={grey900}/></IconButton>
                            }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  >
                    <MenuItem key={1} primaryText="Application 1"/>
                    <MenuItem key={2} primaryText="Application 2"/>
                    <MenuItem key={3} primaryText="Application 3"/>
                  </IconMenu> */}

                  <div className="header-short-bar-left">
                    <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                      <MenuItem value="1" primaryText="Cockpit" />
                      <MenuItem value="2" primaryText="Events" />
                      <MenuItem value="3" primaryText="Users" />
                      <MenuItem value="4" primaryText="Donations" />
                      <MenuItem value="5" primaryText="Shop" />
                      <MenuItem value="6" primaryText="Resources" />
                    </IconMenu>
                  </div>

                  <SearchBox />
                  <p style={style.text}>User</p>
                  <IconButton >
                    <ArrowDown color="black"/>
                  </IconButton>
                  <IconMenu color={grey900}
                            iconButtonElement={
                              <FloatingActionButton
                                  mini={true}
                                  backgroundColor="#ffffff"
                                  zDepth={0}>
                                <Avatar>R</Avatar>
                              </FloatingActionButton>
                            }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Sign out" containerElement={<Link to="/login"/>}/>
                  </IconMenu>
                </div>
              }
            />

        </div>
      );
  }
}

Header.propTypes = {
  styles: PropTypes.object,
  handleChangeRequestNavDrawer: PropTypes.func
};

export default Header;

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
import RaisedButton from 'material-ui/RaisedButton';
import ViewModule from 'material-ui/svg-icons/action/view-module';
import {grey900} from 'material-ui/styles/colors';
import SearchBar from 'material-ui-search-bar';
import SearchBox from './SearchBox';

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
        position: 'absolute',
        width: 600,
        height: 55,
        margin: '0 0 0 -20px',
      },
      inkBarStyle: {
        height: 5,
        background: '#2196F3'
      },
      tabItemContainerStyle: {
        height: 54,
        background: '#ffffff'
      },
      tab: {
        textTransform: 'none'
      },
      button: {
        position: 'absolute',
        left: 0,

        margin: '10px 0 0 900px'
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
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <Tabs
                      inkBarStyle={style.inkBarStyle}
                      tabItemContainerStyle={style.tabItemContainerStyle}
                      style={style.tabs}>
                    <Tab
                        style={style.tab}
                        label="Cockpit" > </Tab>
                    <Tab
                        style={style.tab}
                        label="Events" > </Tab>
                    <Tab
                        style={style.tab}
                        label="Users" > </Tab>
                    <Tab
                        style={style.tab}
                        label="Donations" > </Tab>
                    <Tab
                        style={style.tab}
                        label="Shop" > </Tab>
                    <Tab
                        style={style.tab}
                        label="Resources" > </Tab>
                  </Tabs>
                </MuiThemeProvider>
              }
              iconElementRight={
                <div style={style.iconsRightContainer}>
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
                  <IconMenu color={grey900}
                            iconButtonElement={<IconButton><Avatar>R</Avatar></IconButton>}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Sign out" containerElement={<Link to="/login"/>}/>
                  </IconMenu>
                  <FloatingActionButton
                      mini={true}
                      backgroundColor="#2196F3"
                      zDepth={0}
                      style={style.button}>
                    <ContentAdd />
                  </FloatingActionButton>

                  <RaisedButton
                      backgroundColor="#ffffff"
                      icon={<ArrowDown color="black"/>}
                      buttonStyle={{width: 30}}
                      style={style.userMenu}
                  />

                    <SearchBar
                      onChange={() => console.log('onChange')}
                      onRequestSearch={() => console.log('onRequestSearch')}
                      style={{
                        position: 'absolute',
                          right: 200,
                          top: 5,
                          maxWidth: 200
                      }}
                  />

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

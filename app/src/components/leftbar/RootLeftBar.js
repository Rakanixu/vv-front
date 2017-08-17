import React,  { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import {spacing, typography} from 'material-ui/styles';
import {white, grey600} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import {customgrey, bartextcolor} from '../../theme-colors';

const LeftBar = (props) => {
  let { navDrawerOpen } = props;

  const styles = {
    logoContainer: {
      height: 56,
      overflow: 'hidden',
    },
    logo: {
      width: 110,
      marginTop: 15,
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block',
      height: 32,
      padding: 0
    },
    menuItem: {
      color: bartextcolor,
      fontSize: 14
    },
  };

  return (
    <Drawer
      docked={true}
      open={navDrawerOpen}>
        <div style={styles.logoContainer}>
          <img style={styles.logo} src="/logo-white.png" alt="logo"/>
        </div>
        <div>
          {props.menus.map((menu, index) =>
            <MenuItem
              key={index}
              style={styles.menuItem}
              primaryText={menu.text}
              leftIcon={menu.icon}
              containerElement={<Link to={menu.link}/>}
            />
          )}
        </div>
    </Drawer>
  );
};

LeftBar.propTypes = {
  navDrawerOpen: PropTypes.bool,
  menus: PropTypes.array,
  username: PropTypes.string,
};

export default LeftBar;
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import Nav from './Nav';
import NewMedia from './NewMedia';
import MediaGridList from './MediaGridList';
import axios from 'axios';
import './Media.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');
const moment = require('moment');
const styles = {
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflowX: 'hidden'
  },
  gridList: {
    maxWidth: 1800,
    height: window.innerHeight - 240,
    overflowY: 'auto',
    padding: 50,
    paddingTop: 10,
    margin: 0,
    cols: (window.innerWidth > 1000) ? 2 : 1
  },
  buttonDelete: {
    top: 10,
    right: 10,
    position: 'absolute'
  }
};

class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/media',
      images: [],
      showComponent: [true, false],
      tabs: [
        {
          title: 'Overview',
          handleActive: this._handleTabChange.bind(this)
        }, 
        {
          title: 'New image',
          handleActive: this._handleTabChange.bind(this)
        }
      ]
    };
  }

  onDone() {
    this.setState({ showComponent: [true, false] });
  }

  _handleTabChange = () => {
    const showComponent = this.state.showComponent.move(0,1);
    this.setState({ showComponent: showComponent });
  }

  render() {
    return (
      <div>
        <Nav tabs={this.state.tabs} onTabChange={this._handleTabChange}/>

        <div style={styles.root}>
          { this.state.showComponent[0] ? <MediaGridList/>: null }
          { this.state.showComponent[1] ? <NewMedia onDone={this.onDone.bind(this)} /> : null }
        </div>
      </div>
    )
  }
}

export default withRouter(Media);
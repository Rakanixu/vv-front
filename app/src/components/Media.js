import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import Nav from './Nav';
import NewMedia from './NewMedia';
import MediaGridList from './MediaGridList';
import './Media.css';

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
    height: window.innerHeight - 200,
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
  },
  paperFab: {
    position: 'absolute',
    bottom: 80,
    right: 40
  }
};

class Media extends Component {
  constructor(props) {
    super(props);
  }

  _handlePageChange = () => {
    this.props.history.push('/manager/media/new');
  }

  render() {
    return (
      <div>
        <div style={styles.root}>
          <MediaGridList/>
        </div>
        <FloatingActionButton style={styles.paperFab} onTouchTap={this._handlePageChange.bind(this)}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

export default withRouter(Media);
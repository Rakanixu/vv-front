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
import axios from 'axios';
import './Media.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');
const moment = require('moment');
const styles = {
  root: {
    display: 'flex',
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
    cols: (window.innerWidth > 1000) ? 2 : 1
  },
  buttonEdit: {
    top: 10,
    right: 10,
    position: 'absolute'
  },
  buttonDelete: {
    top: 60,
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

  componentDidMount() {
    this._getImages();
  }

  _handleTabChange = () => {
    const showComponent = this.state.showComponent.move(0,1);
    this.setState({ showComponent: showComponent });
  }

  _getImages() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ images: res.data });
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _handleEdit(e) {
    this.props.history.push('/manager/event/edit/' + e.currentTarget.dataset.id);
  }

  _handleDelete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.dataset.id).then(function(res) {
      this._getImages();
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
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
    return (
      <div>
        <Nav tabs={this.state.tabs} onTabChange={this._handleTabChange}/>

        <div style={styles.root}>
          { this.state.showComponent[0] ? 
          <div>
            <ErrorReporting open={this.state.error !== null}
              error={this.state.error} />

            <GridList ref="grid" cellHeight={320} cols={styles.gridList.cols} style={styles.gridList}>
              <Subheader>Media Images</Subheader>
              {this.state.images.map((event) => (
                <GridTile key={event.id}
                          title={event.title}
                          subtitle={moment(event.date).format("MMM Do YYYY")}
                          actionIcon={<IconButton><StarBorder color="white" /></IconButton>}>
                          <img src={config.baseURL + event.preview_img} />

                          <RaisedButton className="edit" 
                                        label="Edit"
                                        data-id={event.id}
                                        onTouchTap={this._handleEdit.bind(this)}
                                        style={styles.buttonEdit}/>
                          <RaisedButton className="delete" 
                                        data-id={event.id}
                                        onTouchTap={this._handleDelete.bind(this)}
                                        label="Delete" 
                                        style={styles.buttonDelete}/>
                </GridTile>
              ))}
            </GridList>
          </div>  
          : null }
          { this.state.showComponent[1] ? <NewMedia onDone="" /> : null }
        </div>
      </div>
    )
  }
}

export default withRouter(Media);
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './MediaGridList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const styles = {
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

class MediaGridList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/media',
      images: []
    };
  }

  componentDidMount() {
    this._getImages();
  }

  _getImages() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ images: res.data });
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
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
        <ErrorReporting open={this.state.error !== null}
          error={this.state.error} />

        <GridList ref="grid" cellHeight={320} cols={styles.gridList.cols} style={styles.gridList}>
          <Subheader>Media Images</Subheader>
          {this.state.images.map((media) => (
            <GridTile key={media.id}>
              <img src={config.baseURL + media.url} alt="gallery item"/>
              <RaisedButton className="delete"
                            data-id={media.id}
                            onTouchTap={this._handleDelete.bind(this)}
                            label="Delete"
                            style={styles.buttonDelete}/>
            </GridTile>
          ))}
        </GridList>
      </div>
    )
  }
}

export default withRouter(MediaGridList);
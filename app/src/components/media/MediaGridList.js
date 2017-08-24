import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './MediaGridList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const styles = {
  root: {
    padding: 50,
    paddingTop: 20
  },
  gridList: {
    maxWidth: 1800,
    overflowY: 'auto',
    paddingTop: 10,
    cols: 4
  },
  editButton: {
    position: 'relative',
    marginRight: 10
  },
  editLabel: {
    color: '#fff',
    textTransform: 'none'
  },
  deleteButton: {
    position: 'relative',
    marginLeft: 10
  },
  deleteLabel: {
    color: '#fff',
    textTransform: 'none'
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
        <GridList ref="grid"
                  className="media-cards-grid"
                  cellHeight={320}
                  cols={styles.gridList.cols}
                  style={styles.gridList}
                  padding={20}>
          {this.state.images.map((media) => (
            <GridTile key={media.id}
                      className="media-card-block"
            >
              <div className="media-card-block__content">
                <div className="media-card-block-img">
                  <div className="media-card-block-img-wrapper">
                    <div className="media-card-block-img-wrapper-inner">
                      <div className="media-card-block-img-wrapper-inner__img"
                           style={{backgroundImage: `url(${config.baseURL + media.url})`}}>
                      </div>
                    </div>
                    {/*<div className="card-block-title">{media.title}</div>*/}
                  </div>
                </div>
                <div className="media-card-block__content__buttons">
                  <div className="media-card-block__content__buttons__main">
                    <RaisedButton className="media-edit-btn"
                                  label="Edit"
                                  labelStyle={styles.editLabel}
                                  data-id={media.id}
                                  style={styles.editButton}
                    />
                    <RaisedButton className="media-delete-btn"
                                  data-id={media.id}
                                  labelStyle={styles.deleteLabel}
                                  label="Delete"
                                  style={styles.deleteButton}
                                  onTouchTap={this._handleDelete.bind(this)}
                    />
                  </div>
                </div>
              </div>
            </GridTile>
          ))}
        </GridList>
      </div>
    )
  }
}

export default withRouter(MediaGridList);

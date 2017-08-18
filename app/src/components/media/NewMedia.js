import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './NewMedia.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  }
};

class NewMedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: {}
    };
  }

  _onMediaChange = (pictures) => {
    this.setState({ url: pictures });
  }

  _handleNewMedia(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.url === undefined) {
      this._handleError();
      return;
    }

    this._createMedia()
    .then(function(res) {
      this.props.history.push('/manager/media');
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createMedia() {
    var url;
    for (var i in this.state.url) {
      url = this.state.url[i];
      break;
    }

    try {
      url = dataURItoBlob(url);
    } catch (err) {}

    var data = new FormData();
    data.append('url', url);

    return axios.post(config.baseAPI_URL + '/media', data);
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
      <div className="container">
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <form className="newMediaForm">
            <div className="fit">
              <UploadPreview title="Image" label="Add" onChange={this._onMediaChange} style={styles.fit}/>
            </div>

            <RaisedButton label="Save"
                          className="right margin-bottom-medium" 
                          primary={true}
                          onTouchTap={this._handleNewMedia.bind(this)} />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(NewMedia);

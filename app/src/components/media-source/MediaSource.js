import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import ImgSelectionWrapper from '../image/ImgSelectionWrapper';
import axios from 'axios';
import './MediaSource.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var user = {};
var styles = {
  paper: {
    padding: 20,
    overflow: 'auto',
    height: 'min-content'
  }
};

class MediaSource extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      count: 0,
      main_media: {},
      main_media_url: '',
      url: config.baseAPI_URL + '/event/',
      usersUrl: config.baseAPI_URL + '/principal/',
      vip_users: []
    };
  }

  componentWillMount() {
    if (localStorage.getItem('alantu-user')) {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }

    axios.get(this.state.usersUrl + user.principal_id + '/role/5/user').then(res => {
      this.setState({ vip_users: res.data });
    }).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _onMainMediaChange = (img) => {
    this.setState({
      main_media: img,
      main_media_url: ''
    });
  }

  _handleMediaTypeChange = (e, index, val) => {
    this.setState({
      main_media_type_id: val
    });
  }

  _handleSpeakerChange = (e, index, val) => {
    this.setState({
      main_media: val
    });
  }
  
  _handleNewMediaSource(e) {
    this._createMediaSource()
    .then(function(res) {
      var count = this.state.count;
      count++;

      this.setState({
        error: null,
        main_media: {},
        main_media_url: '',
        count: count,
        name: '',
        description: '',
        main_media_file: ''
      });

      if (this.props.onSave) {
        this.props.onSave();
      }
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createMediaSource() {
    if (this.state.main_media_type_id === undefined || this.state.main_media_type_id === '' ||
      this.state.name === undefined || this.state.name === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('main_media_type_id', this.state.main_media_type_id);
    data.append('name', this.state.name);
    data.append('description', this.state.description || '');
    data.append('main_media_file', this.state.main_media_file || '');
    data.append('main_media', this.state.main_media || '');

    return axios.post(this.state.url + this.props.eventId + '/named_guest', data);
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

        <div className={this.props.showNoEditListing ? "container new-admission-container" : "new-admission-container" } >
          <div className="title">
            <h1>New Media Source</h1>
          </div>

          <form className="newEventGuest">
            <Paper style={styles.paper}>
              <TextField floatingLabelText="Name"
                        data-val="name"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <SelectField floatingLabelText="Media type"
                          fullWidth={true}
                          value={this.state.main_media_type_id}
                          onChange={this._handleMediaTypeChange}>
                {config.name_guest_media_type.map((type, i) => (
                  <MenuItem key={i} value={type.id} primaryText={type.name} />
                ))}
              </SelectField>
              { this.state.main_media_type_id === 1 ?
                <div className="image-selector-container">
                  <ImgSelectionWrapper onChange={this._onMainMediaChange.bind(this)} hideDefaultImageButton={true}/>
                </div>
              : null }
              { this.state.main_media_type_id === 2 ?
              <TextField floatingLabelText="Media URL"
                          data-val="main_media"
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
              : null }
              { this.state.main_media_type_id === 3 ?
                <SelectField floatingLabelText="Speaker"
                          fullWidth={true}
                          value={this.state.main_media}
                          onChange={this._handleSpeakerChange.bind(this)}>
                {this.state.vip_users.map((user, i) => (
                  <MenuItem key={i} value={user.email} primaryText={user.email} />
                ))}
              </SelectField>
              : null }


              <div className="overflow">
                <RaisedButton label="Save Source"
                              primary={true}
                              className="right margin-top-medium margin-left-medium" 
                              onTouchTap={this._handleNewMediaSource.bind(this)} />
              </div>                
            </Paper>  
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(MediaSource);

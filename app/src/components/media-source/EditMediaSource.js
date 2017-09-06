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
import './EditMediaSource.css';

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

class EditMediaSource extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      showImg: true,
      mainMediaUrlFromGallery: '',
      main_media: '',
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/named_guest/' + this.props.match.params.eventGuestId,
      usersUrl: config.baseAPI_URL + '/principal/',
      event_guest: {},
      media: [],
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

  componentDidMount() {
    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });

    this._getEventGuest();
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getEventGuest() {
    axios.get(this.state.url).then(function(res) {
      this.setState({
        event_guest: res.data,
        main_media: res.data.main_media,
        mainMediaUrlFromGallery: res.data.main_media
      });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.event_guest[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _onMainMediaChange = (img) => {
    this.state.event_guest.main_media = img;
    this.state.event_guest.main_media_url = '';
    this.setState({ event_guest: this.state.event_guest });
  }

  _handleMediaTypeChange = (e, index, val) => {
    this.state.event_guest.main_media_type_id = val;
    this.setState({ event_guest: this.state.event_guest });
  }

  _handleSpeakerChange = (e, index, val) => {
    this.state.event_guest.main_media = val;
    this.setState({ event_guest: this.state.event_guest });
  }

  _handleEditMediaSource(e) {
    this._editMediaSource()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/' + this._getType() + '/edit/' + this.props.match.params.eventId + '/detail',
        query: {
          showTabs: true,
          index: 0
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editMediaSource() {
    if (this.state.event_guest.main_media_type_id === undefined || this.state.event_guest.main_media_type_id === '' ||
      this.state.event_guest.name === undefined || this.state.event_guest.name === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('main_media_type_id', this.state.event_guest.main_media_type_id);
    data.append('name', this.state.event_guest.name);
    data.append('description', this.state.event_guest.description || '');
    data.append('main_media_file', this.state.event_guest.main_media_file || '');
    data.append('main_media',this.state.event_guest.main_media || '');

    return axios.put(this.state.url, data);
  }

  _handleDialogOpen = () => {
    this.setState({ openDialog: true });
  }

  _handleDialogClose = () => {
    this.setState({openDialog: false});
  }

  _handelImgSelect = (e) => {
    this.setState({
      mainMediaUrlFromGallery: e.currentTarget.dataset.url
    });
    this._handleDialogClose();
  }

  _onImgChange = (pictures) => {
    this.setState({
      main_media: pictures,
      showImg: false
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
      <div className="container">
        <ErrorReporting open={this.state.error !== null}
                  error={this.state.error} />
        <div className="title">
          <h1>Edit Media Source: {this.state.event_guest.name}</h1>
        </div>          

        <form className="edit-event-guest">
          <Paper style={styles.paper}>
            <TextField floatingLabelText="Name"
                      data-val="name"
                      value={this.state.event_guest.name}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Description"
                      data-val="description"
                      value={this.state.event_guest.description}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />

            <SelectField floatingLabelText="Media type"
                        fullWidth={true}
                        value={this.state.event_guest.main_media_type_id}
                        onChange={this._handleMediaTypeChange}>
              {config.name_guest_media_type.map((type) => (
                <MenuItem value={type.id} primaryText={type.name} />
              ))}
            </SelectField>


            { this.state.event_guest.main_media_type_id === 1 ?
                <div className="image-selector-container">
                  <ImgSelectionWrapper onChange={this._onMainMediaChange.bind(this)} hideDefaultImageButton={true}/>
                </div>
              : null }
              { this.state.event_guest.main_media_type_id === 2 ?
              <TextField floatingLabelText="Media URL"
                          data-val="main_media"
                          value={this.state.event_guest.main_media}
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
              : null }
              { this.state.event_guest.main_media_type_id === 3 ?
                <SelectField floatingLabelText="Speaker"
                          fullWidth={true}
                          value={this.state.event_guest.main_media}
                          onChange={this._handleSpeakerChange.bind(this)}>
                {this.state.vip_users.map((user, i) => (
                  <MenuItem key={i} value={user.email} primaryText={user.email} />
                ))}
              </SelectField>
              : null }





            <RaisedButton label="Edit" 
                          className="right margin-top-medium" 
                          primary={true} 
                          onTouchTap={this._handleEditMediaSource.bind(this)} />
          </Paper>  

        </form>
      </div>
    );
  }
}

export default withRouter(EditMediaSource);

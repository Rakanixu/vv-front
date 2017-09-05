import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import ImgSelectionWrapper from '../image/ImgSelectionWrapper';
import axios from 'axios';
import './EditEvent.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const moment = require('moment');

var user = {};
var styles = {
  paperLeft: {
    padding: 20,
    overflow: 'auto',
    width: '66%',
    float: 'left',
    minWidth: 220,
    marginRight: 40,
    height: 'min-content'
  },
  paperRight: {
    padding: 20,
    overflow: 'auto',
    width: '33%',
    float: 'left',
    minWidth: 150,
    height: 'min-content'
  }
};

class EditEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      preview_img: {},
      event_background: {},
      original_speaker_media: '',
      event: {},
      media: []
    };
  }

  componentWillMount() {
    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
    this._getEvent();
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _url() {
    return config.baseAPI_URL + '/' + this._getType() + '/' + this.props.match.params.eventId;
  }

  _getEvent() {
    axios.get(this._url()).then(function(res) {
      res.data.date = new Date(res.data.date);
      this.setState({
        event: res.data,
        eventBackgroundUrlFromGallery: res.data.event_background,
        previewImgUrlFromGallery: res.data.preview_img,
        original_speaker_media: res.data.speaker_media
      });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.event[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _previewImageChange(img) {
    this.setState({ preview_img: img });
  }

  _eventBackgroundChange(img) {
    this.setState({ event_background: img });
  }

  _handelImgSelect = (e) => {
    let obj = {}
    obj[this.state.imgTarget] = e.currentTarget.dataset.url;

    this.setState(obj);
    this._handleDialogClose();
  }

  _handleDateChange = (nil, date) => {
    this.state.event.date = date;
    this.setState({ event: this.state.event });
  }

  _handleTimeChange = (nil, time) => {
    this.state.event.time = time;
    this.setState({ event: this.state.event });
  }

  _handleMediaTypeChange = (e, index, val) => {
    if (val === 1) {
      this.state.event.speaker_media = this.state.original_speaker_media;
    } else if (val === 2) {
      this.state.event.speaker_media = '';
    } else if (val === 3) {
      this.state.event.speaker_media = JSON.parse(localStorage.getItem('alantu-user')).email;
    }

    this.state.event.speaker_media_type = val;
    this.setState({ event: this.state.event });
  }

  _handleLoginRequired = (e, checked) => {
    this.state.event.login_required = !this.state.event.login_required;
    this.setState({ event: this.state.event });
  }

  _onSpeakerMediaChange = (img) => {
    this.state.event.speaker_media = img;
    this.setState({ event: this.state.event });
  }

  _handleEditEvent(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.event.title === undefined || this.state.event.title === "" ||
      this.state.event.date === undefined || this.state.event.date === "" ||
      this.state.event.speaker_media_type === undefined ||
      this.state.event.speaker_media === undefined || this.state.event.speaker_media === "") {
      this._handleError();
      return;
    }

    this._editEvent()
    .then(function(res) {
      this.props.history.push('/manager/' + this._getType() + '/edit/' + res.data.id + '/detail');
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editEvent() {
    var preview_img, event_background, speaker_media;
    if (typeof this.state.preview_img === 'object') {
      for (var i in this.state.preview_img) {
        preview_img = this.state.preview_img[i];
        break;
      }
    }

    if (typeof this.state.event_background === 'object') {
      for (var i in this.state.event_background) {
        event_background = this.state.event_background[i];
        break;
      }
    }

    if (typeof this.state.event.speaker_media === 'object') {
      for (var i in this.state.event.speaker_media) {
        speaker_media = this.state.event.speaker_media[i];
        break;
      }
    }

    try {
      preview_img = dataURItoBlob(preview_img);
      event_background = dataURItoBlob(event_background);
      speaker_media = dataURItoBlob(speaker_media);
    } catch (err) {}

    if (!preview_img) {
      preview_img = this.state.preview_img || this.state.event.preview_img;
    }

    if (!event_background) {
      event_background = this.state.event_background || this.state.event.event_background;
    }

    if (typeof this.state.event.speaker_media === 'object') {
      this.state.event.speaker_media = speaker_media;
    }

    if (this.state.event.time !== undefined) {
      this.state.event.date = moment(this.state.event.date).hour(moment(this.state.event.time).get('hour'));
      this.state.event.date = moment(this.state.event.date).minute(moment(this.state.event.time).get('minute'));
    }

    var now = moment().utc(new Date()).format();
    var data = new FormData();
    data.append('title', this.state.event.title);
    data.append('subtitle', this.state.event.subtitle || '');
    data.append('speaker_media_type', this.state.event.speaker_media_type);
    data.append('notes', this.state.event.notes || '');
    data.append('location', this.state.event.location || '');
    data.append('created_at', this.state.event.created_at);
    data.append('updated_at', now);
    data.append('date', moment(this.state.event.date).utc().format());
    data.append('login_required', this.refs.checkbox.state.switched);
    data.append('principal_id', user.principal_id);
    data.append('user_account_id', user.id);
    data.append('event_type_id', config.event_types.default.id);
    data.append('preview_img', preview_img);
    data.append('event_background', event_background);
    data.append('speaker_media', this.state.event.speaker_media);

    return axios.put(this._url(), data);
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
        <div>
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <div className="title">
            <h1>Edit {this._getType().capitalize()}</h1>
          </div>

          <form className="edit-event-form">
            <Paper style={styles.paperLeft}>
              <TextField floatingLabelText={this._getType().capitalize() + ' title'}
                        data-val="title"
                        primary={true}
                        value={this.state.event.title}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText={this._getType().capitalize() + ' subtitle'}
                        data-val="subtitle"
                        primary={true}
                        value={this.state.event.subtitle}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Notes"
                        data-val="notes"
                        value={this.state.event.notes}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Location"
                        data-val="location"
                        value={this.state.event.location}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              {!this.props.isTemplate ?
              <span>
              <DatePicker hintText="Date"
                        mode="landscape"
                        fullWidth={true}
                        value={this.state.event.date}
                        onChange={this._handleDateChange.bind(this)}/>
              <TimePicker hintText="Time"
                        fullWidth={true}
                        value={this.state.event.date}
                        mode="landscape"
                        autoOk={true}
                        onChange={this._handleTimeChange.bind(this)}/>
              </span>
              : null }
              <SelectField floatingLabelText="Media type"
                          fullWidth={true}
                          value={this.state.event.speaker_media_type}
                          onChange={this._handleMediaTypeChange.bind(this)}>
                {config.name_guest_media_type.map((type, i) => (
                  <MenuItem key={i} value={type.id} primaryText={type.name} />
                ))}
              </SelectField>
              { this.state.event.speaker_media_type === 1 ?
                <ImgSelectionWrapper ref="speakerMediaSelector"
                                     onChange={this._onSpeakerMediaChange.bind(this)}
                                     defaultImage={this.state.event.speaker_media}
                                     hideDefaultImageButton={true}/>
                :
                <TextField floatingLabelText="Speaker media"
                          data-val="speaker_media"
                          primary={true}
                          value={this.state.event.speaker_media}
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
              }
              <div className="checkbox">
                <Checkbox ref="checkbox"
                        checked={this.state.event.login_required}
                        onCheck={this._handleLoginRequired}
                        label="Login required?"/>
              </div>

              <div>
                <RaisedButton label="Save"
                              className="event-wizard-continue-button"
                              primary={true}
                              onTouchTap={this._handleEditEvent.bind(this)} />
              </div>
            </Paper>

            <Paper style={styles.paperRight}>
              <label className="load-img-label">Preview Image</label>
              <ImgSelectionWrapper onChange={this._previewImageChange.bind(this)}
                                   defaultImage={this.state.event.preview_img}
                                   hideDefaultImageButton={true}/>

              <label className="load-img-label margin-top-medium block">Background Image</label>
              <ImgSelectionWrapper onChange={this._eventBackgroundChange.bind(this)}
                                   defaultImage={this.state.event.event_background}
                                   hideDefaultImageButton={true}/>
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditEvent);

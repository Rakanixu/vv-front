import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import ImgSelectionWrapper from '../image/ImgSelectionWrapper';
import axios from 'axios';
import './NewEvent.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const moment = require('moment');

var user = {};
var styles = {
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  gridTile: {
    cursor: 'pointer',
    width: 240
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
  fit: {
    overflow: 'hidden',
    maxHeight: 250
  },
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

class NewEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      openDialog: false,
      imgTarget: '',
      preview_img: {},
      event_background: {},
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
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _handleMediaTypeChange = (e, index, val) => {
    let speaker_media = '';
    if (val === 3) {
      speaker_media = JSON.parse(localStorage.getItem('alantu-user')).email;
    }

    this.setState({
      speaker_media_type: val,
      speaker_media: speaker_media
    });
  }

  _handleDateChange = (nil, date) => {
    this.state.date = moment(date);
  }

  _handleTimeChange = (nil, time) => {
    this.state.time =  moment(time);
  }

  _onEventBackgroundChange = (pictures) => {
    this.setState({ event_background: pictures });
  }

  _onSpeakerMediaChange = (pictures) => {
    this.setState({ speaker_media: pictures });
  }

  _handelImgSelect = (e) => {
    let obj = {}
    obj[this.state.imgTarget] = e.currentTarget.dataset.url

    this.setState(obj);
    this._handleDialogClose();
  }

  _handleNewEvent(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);


    if (this._getType() === 'event') {
      if (this.state.title === undefined || this.state.title === "" ||
        this.state.date === undefined || this.state.date === "" ||
        this.state.speaker_media_type === undefined ||
        this.state.speaker_media === undefined || this.state.speaker_media === "") {
        this._handleError();
        return;
      }
    } else if (this._getType() === 'template') {
      if (this.state.title === undefined || this.state.title === "" ||
        this.state.speaker_media_type === undefined ||
        this.state.speaker_media === undefined || this.state.speaker_media === "") {
        this._handleError();
        return;
      }
    }


    this._createEvent()
    .then(function(res) {
      this.props.history.push('/manager/' + this._getType() + '/edit/' + res.data.id + '/detail');
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _previewImageChange(img) {
    this.setState({ preview_img: img });
  }

  _eventBackgroundChange(img) {
    this.setState({ event_background: img });
  }

  _createEvent() {
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

    if (typeof this.state.speaker_media === 'object') {
      for (var i in this.state.speaker_media) {
        speaker_media = this.state.speaker_media[i];
        break;
      }
    }

    try {
      preview_img = dataURItoBlob(preview_img);
      event_background = dataURItoBlob(event_background);
      speaker_media = dataURItoBlob(speaker_media);
    } catch (err) {}

    if (typeof this.state.preview_img === 'string') {
      preview_img = this.state.preview_img;
    }

    if (typeof this.state.event_background === 'string') {
      event_background = this.state.event_background;
    }

    if (typeof this.state.speaker_media === 'object') {
      this.state.speaker_media = speaker_media;
    }

    if (this.state.time !== undefined) {
      this.state.date = this.state.date.hour(this.state.time.get('hour'));
      this.state.date = this.state.date.minute(this.state.time.get('minute')); 
    }

    var now = moment().utc(new Date()).format();
    var data = new FormData();
    data.append('title', this.state.title);
    data.append('subtitle', this.state.subtitle || '');
    data.append('speaker_media_type', this.state.speaker_media_type);
    data.append('notes', this.state.notes || '');
    data.append('location', this.state.location || '');
    data.append('created_at', now);
    data.append('updated_at', now);
    data.append('deleted_at', '1970-01-01T00:00:00.000Z');
    data.append('started_at', '1970-01-01T00:00:00.000Z');
    data.append('ended_at', '1970-01-01T00:00:00.000Z');
    data.append('date', this.state.date ? this.state.date.utc().format() : null);
    data.append('login_required', this.refs.checkbox.state.switched);
    data.append('principal_id', user.principal_id);
    data.append('user_account_id', user.id);
    data.append('event_type_id', config.event_types.default.id);
    data.append('latitude', 0);
    data.append('longitude', 0);
    data.append('chat_highlight', false);
    data.append('chat_with_user_image', false);
    data.append('pose_question', false);
    data.append('chat_shown_status_bar', false);
    data.append('stage_moment_webcam', false);
    data.append('chat_highlight_price', 0);
    data.append('chat_with_user_image_price', 0);
    data.append('pose_question_price', 0);
    data.append('chat_shown_status_bar_price', 0);
    data.append('stage_moment_webcam_price', 0);
    data.append('preview_img', preview_img);
    data.append('event_background', event_background);
    data.append('speaker_media', this.state.speaker_media);

    return axios.post(config.baseAPI_URL + '/' + this._getType(), data);
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
                  
        <div>
          <div className="title">
            <h1>New {this._getType().capitalize()}</h1>
          </div>

          <form className="new-event-form">
            <Paper style={styles.paperLeft}>
              <TextField floatingLabelText={this._getType().capitalize() + " title"}
                        data-val="title"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText={this._getType().capitalize() + " subtitle"}
                        data-val="subtitle"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />          
              <TextField floatingLabelText="Notes"
                        data-val="notes"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Location"
                        data-val="location"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <DatePicker hintText="Date"
                        fullWidth={true}
                        mode="landscape" 
                        autoOk={true} 
                        onChange={this._handleDateChange.bind(this)}/>
              <TimePicker hintText="Time"
                        fullWidth={true}
                        mode="landscape" 
                        autoOk={true} 
                        onChange={this._handleTimeChange.bind(this)}/>
              <SelectField floatingLabelText="Media type"
                          fullWidth={true}
                          value={this.state.speaker_media_type}
                          onChange={this._handleMediaTypeChange.bind(this)}>
                {config.name_guest_media_type.map((type, i) => (
                  <MenuItem key={i} value={type.id} primaryText={type.name} />
                ))}
              </SelectField>
              { this.state.speaker_media_type === 1 ?
                <div className="fit">
                  <UploadPreview title="Media" label="Add" onChange={this._onSpeakerMediaChange} style={styles.fit}/>
                </div>
                :
                <TextField floatingLabelText="Speaker media"
                          data-val="speaker_media"
                          value={this.state.speaker_media}
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
              }

              <div className="checkbox">
                <Checkbox ref="checkbox" label="Login required?"/>
              </div>
              <div>
                <RaisedButton label="Save"
                              className="event-wizard-continue-button"
                              primary={true}
                              onTouchTap={this._handleNewEvent.bind(this)} />
              </div>
            </Paper>

            <Paper style={styles.paperRight}>
              <label className="load-img-label">Preview Image</label>
              <ImgSelectionWrapper onChange={this._previewImageChange.bind(this)} hideDefaultImageButton={true}/>

              <label className="load-img-label margin-top-medium block">Background Image</label>
              <ImgSelectionWrapper onChange={this._eventBackgroundChange.bind(this)} hideDefaultImageButton={true}/>
            </Paper>  
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(NewEvent);

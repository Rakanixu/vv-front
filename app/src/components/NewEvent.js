import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from './../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './NewEvent.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');
const moment = require('moment');

var user = {};
var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  }, 
  screenHeight: {
    height: window.innerHeight - 250
  }
};

class NewEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      preview_img: {},
      event_background: {}
    };
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _handelPrimaryColorChange(color) {
    this.state.primary_color = color;
  }

  _handelSecondaryColorChange(color) {
    this.state.secondary_color = color;    
  }

  _handleDateChange = (nil, date) => {
    this.state.date = moment(date).utc().format();
  }

  _onPreviewImgChange = (pictures) => {
    this.setState({ preview_img: pictures });
  }

  _onEventBackgroundChange = (pictures) => {
    this.setState({ event_background: pictures });
  }

  _handleNewEvent(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.title === undefined || this.state.title === "") {
      this._handleError();
      return;
    }

    this._createEvent()
    .then(function(res) {
      this.props.onDone(res.data.id);
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createEvent() {
    var preview_img, event_background;
    for (var i in this.state.preview_img) {
      preview_img = this.state.preview_img[i];
      break;
    }

    for (var i in this.state.event_background) {
      event_background = this.state.event_background[i];
      break;
    }

    try {
      preview_img = dataURItoBlob(preview_img);
      event_background = dataURItoBlob(event_background);
    } catch (err) {}

    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieve'));
      return;
    }

    var now = moment().utc(new Date()).format();
    var data = new FormData();
    data.append('title', this.state.title);
    data.append('notes', this.state.notes);
    data.append('location', this.state.location);
    data.append('created_at', now);
    data.append('updated_at', now);
    data.append('deleted_at', '1970-01-01T00:00:00.000Z');
    data.append('date', this.state.date);
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
    data.append('preview_img', preview_img);
    data.append('event_background', event_background);

    return axios.post(config.baseAPI_URL + '/event', data);
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
      <div className="container" style={styles.screenHeight}>
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <form className="newEventForm">
            <TextField floatingLabelText="Event title" 
                      data-val="title"
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
            <DatePicker hintText="Date" mode="landscape" autoOk={true} onChange={this._handleDateChange.bind(this)}/>
            <div className="checkbox">
              <Checkbox ref="checkbox" label="Login required?"/>
            </div>
            <div className="fit">
              <UploadPreview title="Preview event image" label="Add" onChange={this._onPreviewImgChange} style={styles.fit}/>  
            </div>
            <div className="fit">
              <UploadPreview title="Event background" label="Add" onChange={this._onEventBackgroundChange} style={styles.fit}/>  
            </div>
            <div>
              <RaisedButton label="Save & Continue" 
                            className="event-wizard-continue-button" 
                            primary={true} 
                            onTouchTap={this._handleNewEvent.bind(this)} />
            </div>
          </form>
        </div>  
      </div>
    );
  }
}

export default withRouter(NewEvent);

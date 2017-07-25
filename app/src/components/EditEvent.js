import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from './../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import EventTabs from './EventTabs';
import axios from 'axios';
import './EditEvent.css';

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
    height: window.innerHeight - 180
  }
};

class EditEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      showPreviewImg: true,
      showEventBackground: true,
      showTabs: false,
      tabIndex: 0,
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId,
      preview_img: {},
      event_background: {},
      event: {}
    };
  }

  componentWillMount() {
    if (this.props.location.query) {
      this.setState({
        showTabs: this.props.location.query.showTabs,
        tabIndex: this.props.location.query.index ? this.props.location.query.index : 0
      });
    }
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
    this._getEvent();
  }

  _getEvent() {
    axios.get(this.state.url).then(function(res) {
      res.data.date = new Date(res.data.date);
      this.setState({ event: res.data });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.event[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handleDateChange = (nil, date) => {
    this.state.event.date = date;
    this.setState({ event: this.state.event });
  }

  _onPreviewImgChange = (pictures) => {
    this.setState({ 
      preview_img: pictures,
      showPreviewImg: false      
    });
  }

  _onEventBackgroundChange = (pictures) => {
    this.setState({ 
      event_background: pictures,
      showEventBackground: false
    });
  }

  _handleEditEvent(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.event.title === undefined || this.state.event.title === "") {
      this._handleError();
      return;
    }

    this._editEvent()
    .then(function(res) {
      this.setState({ showTabs: true });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editEvent() {
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

    if (!preview_img) {
      preview_img = this.state.event.preview_img;
    }

    if (!event_background) {
      event_background = this.state.event.event_background;
    }

    var now = moment().utc(new Date()).format();
    var date = new Date(this.state.event.date);
    var data = new FormData();
    data.append('title', this.state.event.title);
    data.append('notes', this.state.event.notes);
    data.append('location', this.state.event.location);
    data.append('created_at', this.state.event.created_at);
    data.append('updated_at', now);
    data.append('date', moment().utc(date).format());
    data.append('login_required', this.refs.checkbox.state.switched);
    data.append('principal_id', user.principal_id);
    data.append('user_account_id', user.id);
    data.append('event_type_id', config.event_types.default.id);
    data.append('preview_img', preview_img);
    data.append('event_background', event_background);

    return axios.put(this.state.url, data);
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
          { !this.state.showTabs ? 
            <div>
              <ErrorReporting open={this.state.error !== null}
                        error={this.state.error} />

              <form className="newEventForm">
                <TextField floatingLabelText="Event title" 
                          data-val="title"
                          value={this.state.event.title}
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
                <DatePicker hintText="Date" mode="landscape" value={this.state.event.date} onChange={this._handleDateChange.bind(this)}/>
                <div className="checkbox">
                  <Checkbox ref="checkbox" checked={this.state.event.login_required} label="Login required?"/>
                </div>
                { this.state.showPreviewImg ? <img className="preview-img" src={config.baseURL + this.state.event.preview_img} alt="preview"/> : null }
                <div className="fit">
                  <UploadPreview title="Preview event image" label="Select new file" onChange={this._onPreviewImgChange} style={styles.fit}/>  
                </div>
                { this.state.showEventBackground ? <img className="preview-img" src={config.baseURL + this.state.event.event_background} alt="preview"/> : null }
                <div className="fit">
                  <UploadPreview title="Event background" label="Select new file" onChange={this._onEventBackgroundChange} style={styles.fit}/>  
                </div>
                <div>
                  <RaisedButton label="Save & Continue" 
                                className="event-wizard-continue-button" 
                                primary={true} 
                                onTouchTap={this._handleEditEvent.bind(this)} />
                </div>
              </form>
            </div>
          : <EventTabs eventId={this.props.match.params.eventId} index={this.state.tabIndex}/> }
        </div>  
      </div>
    );
  }
}

export default withRouter(EditEvent);

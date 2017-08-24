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
import EventGuestList from './EventGuestList';
import axios from 'axios';
import './EventGuests.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');

var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  },
  screenHeight: {
    height: window.innerHeight - 250
  },
  paper: {
    padding: 20,
    overflow: 'auto',
    height: 'min-content'
  }
};

class EventGuests extends Component {
  constructor(props) {
    super(props);

    if (this.props.noFit) {
      delete styles.screenHeight.height;
    }

    this.state = {
      error: null,
      count: 0,
      main_media: {},
      main_media_url: '',
      url: config.baseAPI_URL + '/event/'
    };
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _onMainMediaChange = (pictures) => {
    this.setState({
      main_media: pictures,
      main_media_url: ''
    });
  }

  _handleMediaTypeChange = (e, index, val) => {
    this.setState({
      main_media_type_id: val
    });
  }

  _handleNewEventGuest(e) {
    this._createGuest()
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

  _createGuest() {
    var main_media;
    for (var i in this.state.main_media) {
      main_media = this.state.main_media[i];
      break;
    }

    try {
      main_media = dataURItoBlob(main_media);
    } catch (err) {}

    if (this.state.main_media_url !== undefined && this.state.main_media_url !== '') {
      main_media = this.state.main_media_url;
    }

    if (this.state.main_media_type_id === undefined || this.state.main_media_type_id === '' ||
      this.state.name === undefined || this.state.name === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('main_media_type_id', this.state.main_media_type_id);
    data.append('name', this.state.name);
    data.append('description', this.state.description || '');
    data.append('main_media_file', this.state.main_media_file || '');
    data.append('main_media', main_media || '');

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
        <div className="container" key={this.state.count}>
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          { this.props.showNoEditListing ?
            <EventGuestList key={this.state.count} noEdit={true} eventId={this.props.eventId}/>
            : null }
        </div>

        <div className={this.props.showNoEditListing ? "container new-admission-container" : "new-admission-container" } >
          <div className="title">
            <h1>New Event Guest</h1>
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
                {config.name_guest_media_type.map((type) => (
                  <MenuItem value={type.id} primaryText={type.name} />
                ))}
              </SelectField>
              { this.state.main_media_type_id === 1 ?
                <div className="fit">
                  <UploadPreview title="Media" label="Add" onChange={this._onMainMediaChange} style={styles.fit}/>
                </div>
                :
                <TextField floatingLabelText="Media URL"
                          data-val="main_media_url"
                          onChange={this._handleTextFieldChange.bind(this)}
                          fullWidth={true} />
              }
              <div className="overflow">
                <RaisedButton label="Save Guest"
                              primary={true}
                              className="right margin-top-medium margin-left-medium" 
                              onTouchTap={this._handleNewEventGuest.bind(this)} />
              </div>                

              <div className="overflow">
                <RaisedButton label="Continue"
                              className="right margin-top-medium margin-left-medium" 
                              primary={true}
                              onTouchTap={this.props.onDone.bind(null, this.props.eventId)} />
              </div>
            </Paper>  
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EventGuests);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from './../utils';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EventGuests.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');

var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  }, 
  screenHeight: {
    height: window.innerHeight - 220
  }
};

class EventGuests extends Component {
  constructor(props) {
    super(props);

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

    var data = new FormData();
    data.append('main_media_type_id', this.state.main_media_type_id);
    data.append('name', this.state.name);
    data.append('description', this.state.description);
    data.append('main_media_file', this.state.main_media_file);
    data.append('main_media', main_media);

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
      <div className="container" key={this.state.count} style={styles.screenHeight}>
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <form className="newEventGuest">
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

            <RaisedButton label="Save Guest" fullWidth={true} onTouchTap={this._handleNewEventGuest.bind(this)} />
          </form>

          <div>
            <RaisedButton label="Continue"                           
                          className="event-wizard-continue-button" 
                          primary={true} 
                          onTouchTap={this.props.onDone.bind(null, this.props.eventId)} />
          </div>
        </div>  
      </div>
    );
  }
}

export default withRouter(EventGuests);

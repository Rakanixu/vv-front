import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from './../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import AdmissionsList from './AdmissionsList';
import axios from 'axios';
import './Admissions.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');

var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  }, 
  screenHeight: {
    height: window.innerHeight - 250
  }
};

class Admissions extends Component {
  constructor(props) {
    super(props);

    if (this.props.noFit) {
      delete styles.screenHeight.height;
    }

    this.state = {
      error: null,
      count: 0,
      icon: {},
      url: config.baseAPI_URL + '/event/'
    };
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _onIconChange = (pictures) => {
    this.setState({ icon: pictures });
  }

  _handleNewAdmission(e) {
    this._createAdmission()
    .then(function(res) {
      var count = this.state.count;
      count++;

      this.setState({
        error: null,
        icon: {},
        count: count,
        title: '',
        subtitle: '',
        price: '',
        description: ''
      });

      if (this.props.onSave) {
        this.props.onSave();
      }
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createAdmission() {
    var icon;
    for (var i in this.state.icon) {
      icon = this.state.icon[i];
      break;
    }

    try {
      icon = dataURItoBlob(icon);
    } catch (err) {}

    var data = new FormData();
    data.append('title', this.state.title);
    data.append('subtitle', this.state.subtitle);
    data.append('price', this.state.price);
    data.append('description', this.state.description);
    data.append('icon', icon);

    return axios.post(this.state.url + this.props.eventId + '/admission', data);
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

          { this.props.showNoEditListing ?
            <AdmissionsList key={this.state.count} noEdit={true} eventId={this.props.eventId}/>
            : null }

          <form className="newAdmissions">
            <TextField floatingLabelText="Title" 
                      data-val="title"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Subtitle"
                      data-val="subtitle"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Price"
                      data-val="price"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />                      
            <TextField floatingLabelText="Description"
                      data-val="description"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />     

            <div className="fit">
              <UploadPreview title="Icon" label="Add" onChange={this._onIconChange} style={styles.fit}/>  
            </div>

            <RaisedButton label="Save Admission" fullWidth={true} onTouchTap={this._handleNewAdmission.bind(this)} />
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

export default withRouter(Admissions);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from './../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './NewEventLocation.css';

const config = require('./../config.json');
const moment = require('moment');
var user = {};
var styles = {
  screenHeight: {
    height: window.innerHeight - 150
  }
};

class NewEventLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      background: {},
      logo: {}
    };
  }

  componentWillMount() {
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

  _handleDateChange = (nil, date) => {
    this.state.opening_hours = moment(date).utc().format();
  }

  _handleNewEventLocation(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.title === undefined || this.state.title === '' || 
      this.state.street === undefined || this.state.street === '' ||
      this.state.city === undefined || this.state.city === '' ||
      this.state.zip === undefined || this.state.zip === '' ||
      this.state.opening_hours === undefined || this.state.opening_hours === '') {
      this._handleError();
      return;
    }

    this._createEventLocation()
    .then(function(res) {
      this.props.history.push('/manager/event_location');
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createEventLocation() {
    var data = new URLSearchParams();
    data.append('principal_id', user.principal_id);
    data.append('title', this.state.title);
    data.append('remark', this.state.remark);
    data.append('street', this.state.street);
    data.append('city', this.state.city);
    data.append('zip', this.state.zip);
    data.append('opening_hours', this.state.opening_hours);

    return axios.post(config.baseAPI_URL + '/event_location', data);
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
          <form className="NewEventLocationForm">
            <TextField floatingLabelText="Title" 
                      data-val="title"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Remark"
                      data-val="remark"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Street"
                      data-val="street"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />                  
            <TextField floatingLabelText="City"
                      data-val="city"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="ZIP"
                      data-val="zip"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <DatePicker hintText="Date" mode="landscape" autoOk={true} onChange={this._handleDateChange.bind(this)}/>          

            <RaisedButton label="Save Event Location" fullWidth={true} onTouchTap={this._handleNewEventLocation.bind(this)} />
          </form>
        </div>  
      </div>
    );
  }
}

export default withRouter(NewEventLocation);

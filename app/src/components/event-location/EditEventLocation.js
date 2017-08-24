import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditEventLocation.css';

const config = require('../../config.json');
const moment = require('moment');
var user = {};
var styles = {
  screenHeight: {
    height: window.innerHeight - 150
  }
};

class EditEventLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/event_location/' + this.props.match.params.eventLocationId,
      event_location: {}
    };
  }

  componentWillMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }

    this._getEventLocation();
  }

  _getEventLocation() {
    axios.get(this.state.url).then(function(res) {
      res.data.opening_hours = new Date(res.data.opening_hours);
      this.setState({ event_location: res.data });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.event_location[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handleDateChange = (nil, date) => {
    this.state.event_location.opening_hours = date;
    this.setState({ event_location: this.state.event_location });
  }

  _handleEditEventLocation(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.event_location.title === undefined || this.state.event_location.title === '' ||
      this.state.event_location.street === undefined || this.state.event_location.street === '' ||
      this.state.event_location.city === undefined || this.state.event_location.city === '' ||
      this.state.event_location.zip === undefined || this.state.event_location.zip === '' ||
      this.state.event_location.opening_hours === undefined || this.state.event_location.opening_hours === '') {
      this._handleError();
      return;
    }

    this._editEventLocation()
    .then(function(res) {
      this.props.history.push('/manager/event_location');
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editEventLocation() {
    var data = new URLSearchParams();
    data.append('principal_id', user.principal_id);
    data.append('title', this.state.event_location.title || '');
    data.append('remark', this.state.event_location.remark || '');
    data.append('street', this.state.event_location.street || '');
    data.append('city', this.state.event_location.city || '');
    data.append('zip', this.state.event_location.zip || '');
    data.append('opening_hours', moment(this.state.event_location.opening_hours).utc().format());

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
      <div className="container">
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />
          <form className="EditEventLocationForm">
            <TextField floatingLabelText="Title"
                      data-val="title"
                      value={this.state.event_location.title}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Remark"
                      data-val="remark"
                      value={this.state.event_location.remark}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Street"
                      data-val="street"
                      value={this.state.event_location.street}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="City"
                      data-val="city"
                      value={this.state.event_location.city}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="ZIP"
                      data-val="zip"
                      value={this.state.event_location.zip}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <DatePicker hintText="Date"
                      mode="landscape"
                      autoOk={true}
                      fullWidth={true}
                      value={this.state.event_location.opening_hours}
                      onChange={this._handleDateChange.bind(this)}/>
            <RaisedButton label="Save Event Location"
                      className="right margin-bottom-medium margin-top-medium"
                      primary={true}
                      onTouchTap={this._handleEditEventLocation.bind(this)} />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditEventLocation);

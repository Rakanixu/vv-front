import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './Polls.css';

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

class Polls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      count: 0,
      url: config.baseAPI_URL + '/event/'
    };
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _handleNewPoll(e) {
    this._createPoll()
    .then(function(res) {
      var count = this.state.count;
      count++;

      this.setState({
        error: null,
        count: count,
        name: '',
        description: ''
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createPoll() {
    var data = new FormData();
    data.append('name', this.state.name);
    data.append('description', this.state.description);

    return axios.post(this.state.url + this.props.eventId + '/poll', data);
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

          <form className="newAdmissions">
            <TextField floatingLabelText="Poll name" 
                      data-val="name"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />                  
            <TextField floatingLabelText="Description"
                      data-val="description"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />     

            <RaisedButton label="Save Poll" fullWidth={true} onTouchTap={this._handleNewPoll.bind(this)} />
          </form>

          <RaisedButton label="Continue" fullWidth={true} onTouchTap={this.props.onDone.bind(null, this.props.eventId)} />
        </div>  
      </div>
    );
  }
}

export default withRouter(Polls);

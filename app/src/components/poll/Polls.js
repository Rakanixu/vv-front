import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './Polls.css';

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

class Polls extends Component {
  constructor(props) {
    super(props);

    if (this.props.noFit) {
      delete styles.screenHeight.height;
    }

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

      if (this.props.onSave) {
        this.props.onSave();
      }
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createPoll() {
    if (this.state.name === undefined || this.state.name === '' ||
      this.state.description === undefined || this.state.description === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

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
      <div>
        <ErrorReporting open={this.state.error !== null}
                        error={this.state.error} />

        <div className={this.props.showNoEditListing ? "container new-admission-container" : "new-admission-container" } >
          <div className="title">
            <h1>New Poll</h1>
          </div>

          <form className="new-poll-form">
            <Paper style={styles.paper}>
              <TextField floatingLabelText="Poll name"
                        data-val="name"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <div className="overflow">
                <RaisedButton label="Save Poll"
                              className="right margin-top-medium margin-left-medium" 
                              primary={true}
                              onTouchTap={this._handleNewPoll.bind(this)} />
              </div>                
            </Paper>
          </form>
        </div>  
      </div>
    );
  }
}

export default withRouter(Polls);

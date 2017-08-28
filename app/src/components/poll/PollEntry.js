import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import IconSelection from '../image/IconSelection';
import axios from 'axios';
import './PollEntry.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');

var styles = {
  paperLeft: {
    padding: 20,
    overflow: 'auto',
    width: '50%',
    float: 'left',
    minWidth: 220,
    marginRight: 40,
    height: 'min-content'
  },
  paperRight: {
    padding: 20,
    overflow: 'auto',
    width: '50%',
    float: 'left',
    minWidth: 150,
    height: 'min-content'
  }
};

class PollEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      poll_id: this.props.match.params.pollId,
      pollEntriesUrl: config.baseAPI_URL + '/poll',
      title: '',
      description: '',
      icon: ''
    };
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _iconChange(img) {
    this.setState({ icon: img });
  }

  _handleNewPollEntry(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    this._createPollEntry()
    .then(function(res) {
      if (this.props.onSave) {
        this.props.onSave();
      }

      if (this.props.onDone) {
        this.props.onDone();
      }
    }.bind(this))
    .catch(function(err){
      this._handleError(err);
    }.bind(this));
  }

  _createPollEntry() {
    if (this.state.title === undefined || this.state.title === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new URLSearchParams();
    data.append('poll_id', this.state.poll_id);
    data.append('title', this.state.title);
    data.append('description', this.state.description || '');
    data.append('icon', this.state.icon);

    return axios.post(this.state.pollEntriesUrl + '/' + this.state.poll_id + '/poll_entry', data);
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

        <div className="new-poll-entry-container">
          <div className="title">
            <h1>New Poll Entry</h1>
          </div>

          <form className="new-poll-entry-form">
            <Paper style={styles.paperLeft}>
              <TextField floatingLabelText="Title"
                        data-val="title"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              
              <div className="overtflow">
                <RaisedButton label="Save poll entry"
                              className="right margin-top-medium margin-left-medium"
                              primary={true}
                              onTouchTap={this._handleNewPollEntry.bind(this)} />
              </div>
            </Paper>

            <Paper style={styles.paperRight}>
              <IconSelection onChange={this._iconChange.bind(this)} hideDefaultImageButton={true}/>
            </Paper>  
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(PollEntry);

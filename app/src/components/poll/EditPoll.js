import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import PollEntry from '../poll/PollEntry';
import PollEntryList from '../poll/PollEntryList';
import axios from 'axios';
import './EditPoll.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var styles = {
  paper: {
    padding: 20,
    overflow: 'auto',
    height: 'min-content',
    width: '100%'
  }
};

class EditPoll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/poll/' + this.props.match.params.pollId,
      poll: {}
    };
  }

  componentDidMount() {
    this._getPoll();
  }

  reloadPollEntry() {
    this.setState({
      reloadPollEntryList: new Date().getTime()
    });
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getPoll() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ poll: res.data });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.poll[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handleEditAdmission(e) {
    this._editPoll()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/' + this._getType() + '/edit/' + this.props.match.params.eventId + '/detail',
        query: {
          showTabs: true,
          index: 2
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editPoll() {
    if (this.state.poll.name === undefined || this.state.poll.name === '' ||
      this.state.poll.description === undefined || this.state.poll.description === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('name', this.state.poll.name);
    data.append('description', this.state.poll.description);

    return axios.put(this.state.url, data);
  }

  _goDetailPage() {
    this._editPoll()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/' + this._getType() + '/edit/' + this.props.match.params.eventId + '/detail',
        query: {
          showTabs: true,
          index: 3
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
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
        <div className="container">
          <div className="title">
            <h1>Edit Poll: {this.state.poll.name}</h1>
            <div className="finish-later">
              <RaisedButton label="Finish later" 
                            className="right margin-top-medium grey" 
                            onTouchTap={this._goDetailPage.bind(this)} />
            </div> 
          </div>

          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <form className="edit-poll">
            <Paper style={styles.paper}>
              <TextField floatingLabelText="Name"
                        data-val="name"
                        value={this.state.poll.name}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        value={this.state.poll.description}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <RaisedButton label="Edit" 
                            className="right margin-top-medium" 
                            primary={true} 
                            onTouchTap={this._handleEditAdmission.bind(this)} />
            </Paper>
          </form>
        </div>

        <div className="container no-padding-top">
          <div className="title">
            <h1>Poll Entries</h1>
          </div>
          <PollEntryList isTemplate={this.props.isTemplate} key={this.state.reloadPollEntryList} eventId={this.props.match.params.eventId}/>
          <PollEntry isTemplate={this.props.isTemplate} onDone={this.reloadPollEntry.bind(this)} eventId={this.props.match.params.eventId} />
        </div>
      </div>
    );
  }
}

export default withRouter(EditPoll);

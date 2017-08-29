import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import IconSelection from '../image/IconSelection';
import axios from 'axios';
import './EditPollEntry.css';

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

class EditPollEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/poll/' + this.props.match.params.pollId + '/poll_entry/' + this.props.match.params.pollEntryId,
      poll_entry: {}
    };
  }

  componentDidMount() {
    this._getQuestionTopic();
  }

  _getQuestionTopic() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ poll_entry: res.data });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.poll_entry[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _iconChange(img) {
    this.state.poll_entry.icon = img;
    this.setState({ poll_entry: this.state.poll_entry });
  }

  _handleQuestionTopic(e) {
    this._EditPollEntry()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/event/edit/' + this.props.match.params.eventId + '/poll/' + this.props.match.params.pollId,
        query: {
          showTabs: true,
          index: 7
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _EditPollEntry() {
    if (this.state.poll_entry.title === undefined || this.state.poll_entry.title === '' ||
      this.state.poll_entry.icon === undefined || this.state.poll_entry.icon === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new URLSearchParams();
    data.append('poll_id', this.state.poll_entry.poll_id);
    data.append('title', this.state.poll_entry.title);
    data.append('description', this.state.poll_entry.description || '');
    data.append('icon', this.state.poll_entry.icon);

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
        <ErrorReporting open={this.state.error !== null}
                  error={this.state.error} />

        <div className="title">
          <h1>Edit Poll Entry</h1>
        </div>

        <form className="edit-poll-entry">
          <Paper style={styles.paperLeft}>
            <TextField floatingLabelText="Title"
                      data-val="title"
                      value={this.state.poll_entry.title}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Description"
                      data-val="description"
                      value={this.state.poll_entry.description}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />

            <RaisedButton label="Save" 
                          className="right margin-top-medium" 
                          primary={true} 
                          onTouchTap={this._handleQuestionTopic.bind(this)} />
          </Paper>

          <Paper style={styles.paperRight}>
              <IconSelection onChange={this._iconChange.bind(this)} 
                             defaultIcon={this.state.poll_entry.icon}
                             hideDefaultImageButton={true}/>
            </Paper>  
        </form>
      </div>
    );
  }
}

export default withRouter(EditPollEntry);

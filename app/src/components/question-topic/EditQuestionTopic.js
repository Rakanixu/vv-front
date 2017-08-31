import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditQuestionTopic.css';

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

class EditQuestionTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/question_topic/' + this.props.match.params.questionTopicId,
      question_topic: {}
    };
  }

  componentDidMount() {
    this._getQuestionTopic();
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getQuestionTopic() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ question_topic: res.data });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.question_topic[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handleQuestionTopic(e) {
    this._editQuestionTopic()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/' + this._getType() + '/edit/' + this.props.match.params.eventId + '/detail',
        query: {
          showTabs: true,
          index: 4
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editQuestionTopic() {
    if (this.state.question_topic.topic === undefined || this.state.question_topic.topic === '' ||
      this.state.question_topic.description === undefined || this.state.question_topic.description === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('topic', this.state.question_topic.topic);
    data.append('description', this.state.question_topic.description);

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

          <form className="edit-question-topic">
            <Paper style={styles.paper}>
              <TextField floatingLabelText="Topic"
                        data-val="topic"
                        value={this.state.question_topic.topic}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        value={this.state.question_topic.description}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <RaisedButton label="Edit" 
                            className="right margin-top-medium margin-left-medium" 
                            primary={true}
                            onTouchTap={this._handleQuestionTopic.bind(this)} />
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditQuestionTopic);

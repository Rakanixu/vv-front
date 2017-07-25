import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from './../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditQuestionTopic.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');
var styles = {
  screenHeight: {
    height: window.innerHeight - 250
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
        pathname: '/manager/event/edit/' + this.props.match.params.eventId,
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

  _editQuestionTopic() {
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
      <div className="container" style={styles.screenHeight}>
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <form className="editSliderImage">
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

            <RaisedButton label="Edit" fullWidth={true} onTouchTap={this._handleQuestionTopic.bind(this)} />
          </form>
        </div>  
      </div>
    );
  }
}

export default withRouter(EditQuestionTopic);

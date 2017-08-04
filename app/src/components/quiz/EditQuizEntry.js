import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditQuizEntry.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var styles = {
  screenHeight: {
    height: window.innerHeight - 250
  }
};

class EditQuizEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/quiz/' + this.props.match.params.quizId + '/quiz_entry/' + this.props.match.params.quizEntryId,
      quiz_entry: {}
    };
  }

  componentDidMount() {
    this._getQuestionTopic();
  }

  _getQuestionTopic() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ quiz_entry: res.data });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.quiz_entry[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handleQuestionTopic(e) {
    this._EditQuizEntry()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/event/edit/' + this.props.match.params.eventId,
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

  _EditQuizEntry() {
    var data = new URLSearchParams();
    data.append('quiz_id', this.state.quiz_entry.quiz_id);
    data.append('question', this.state.quiz_entry.question);
    data.append('answer_one', this.state.quiz_entry.answer_one);
    data.append('answer_two', this.state.quiz_entry.answer_two);
    data.append('answer_three', this.state.quiz_entry.answer_three);
    data.append('answer_four', this.state.quiz_entry.answer_four);
    data.append('right_solution', this.state.quiz_entry.right_solution);

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
            <TextField floatingLabelText="Question"
                      data-val="question"
                      value={this.state.quiz_entry.question}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Answer one"
                      data-val="answer_one"
                      value={this.state.quiz_entry.answer_one}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Answer two"
                      data-val="answer_two"
                      value={this.state.quiz_entry.answer_two}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Answer three"
                      data-val="answer_three"
                      value={this.state.quiz_entry.answer_three}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Answer four"
                      data-val="answer_four"
                      value={this.state.quiz_entry.answer_four}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Right solution"
                      data-val="right_solution"
                      value={this.state.quiz_entry.right_solution}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />

            <RaisedButton label="Edit" fullWidth={true} onTouchTap={this._handleQuestionTopic.bind(this)} />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditQuizEntry);

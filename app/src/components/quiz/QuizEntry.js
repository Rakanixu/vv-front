import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import QuizEntryList from './QuizEntryList';
import axios from 'axios';
import './QuizEntry.css';

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

class QuizEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      quiz_id: this.props.match.params.quizId,
      quizzesUrl: config.baseAPI_URL + '/event/' + this.props.eventId,
      quizEntriesUrl: config.baseAPI_URL + '/quiz',
      question: '',
      answer_one: '',
      answer_two: '',
      answer_three: '',
      answer_four: '',
      right_solution: ''
    };
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _handleNewQuizEntry(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    this._createQuizEntry()
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

  _createQuizEntry() {
    if (this.state.question === undefined || this.state.question === '' ||
      this.state.right_solution === undefined) {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new URLSearchParams();
    data.append('quiz_id', this.state.quiz_id);
    data.append('question', this.state.question);
    data.append('answer_one', this.state.answer_one || '');
    data.append('answer_two', this.state.answer_two || '');
    data.append('answer_three', this.state.answer_three || '');
    data.append('answer_four', this.state.answer_four || '');
    data.append('right_solution', this.state.right_solution);

    return axios.post(this.state.quizEntriesUrl + '/' + this.state.quiz_id + '/quiz_entry', data);
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

        <div className="new-quiz-entry-container">
          <div className="title">
            <h1>New Quiz Entry</h1>
          </div>

          <form className="new-quiz-entry-form">
            <Paper style={styles.paper}>  
              <TextField floatingLabelText="Question"
                        data-val="question"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Answer one"
                        data-val="answer_one"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Answer two"
                        data-val="answer_two"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Answer three"
                        data-val="answer_three"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Answer four"
                        data-val="answer_four"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Right solution"
                        data-val="right_solution"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <div className="overtflow">
                <RaisedButton label="Save quiz entry"
                              className="right margin-top-medium margin-left-medium"
                              primary={true}
                              onTouchTap={this._handleNewQuizEntry.bind(this)} />
              </div>
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(QuizEntry);

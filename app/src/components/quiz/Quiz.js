import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import QuizList from './QuizList';
import axios from 'axios';
import './Quiz.css';

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

class Quiz extends Component {
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

  _handleNewQuiz(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.name === undefined || this.state.name === '') {
      this._handleError();
      return;
    }

    this._createQuiz()
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

  _createQuiz() {
    var data = new FormData();
    data.append('name', this.state.name);
    data.append('description', this.state.description);

    return axios.post(this.state.url + this.props.eventId + '/quiz', data);
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
        <div className="container" key={this.state.count}>
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          { this.props.showNoEditListing ?
            <QuizList key={this.state.count} noEdit={true} eventId={this.props.eventId}/>
            : null }
        </div>    

        <div className={this.props.showNoEditListing ? "container new-quiz-container" : "new-quiz-container" } >
          <div className="title">
            <h1>New Quiz</h1>
          </div>

          <form className="new-quiz-form">
            <Paper style={styles.paper}>
              <TextField floatingLabelText="Name"
                        data-val="name"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <div className="overflow">
                <RaisedButton label="Save Quiz" 
                              className="right margin-top-medium margin-left-medium"
                              primary={true}
                              onTouchTap={this._handleNewQuiz.bind(this)} />
              </div>
              <div className="overflow">
                <RaisedButton label="Continue"
                              className="right margin-top-medium margin-left-medium"
                              primary={true}
                              onTouchTap={this.props.onDone.bind(null, this.props.eventId)} />
              </div>
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Quiz);

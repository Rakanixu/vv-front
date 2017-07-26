import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './QuizEntry.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');

var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  }, 
  screenHeight: {
    height: window.innerHeight - 250
  }
};

class QuizEntry extends Component {
  constructor(props) {
    super(props);

    if (this.props.noFit) {
      delete styles.screenHeight.height;
    }

    this.state = {
      error: null,
      count: 0,
      url: config.baseAPI_URL + '/event/' + this.props.eventId,
      quizzes: []
    };
  }

  componentDidMount() {
    this._getQuizzes();
  }

  _getQuizzes() {
    axios.get(this.state.url + '/quiz').then(function(res) {
      this.setState({ quizzes: res.data });
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
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

    if (this.state.name === undefined || this.state.name === '') {
      this._handleError();
      return;
    }

    this._createQuizEntry()
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

  _createQuizEntry() {
    var data = new FormData();
    data.append('name', this.state.name);
    data.append('description', this.state.description);

    return axios.post(this.state.url + this.props.eventId + '/QuizEntry', data);
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

          <form className="newQuizEntry">
            <TextField floatingLabelText="Name" 
                      data-val="name"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />                
            <TextField floatingLabelText="Description"
                      data-val="description"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />     

            <RaisedButton label="Save QuizEntry" fullWidth={true} onTouchTap={this._handleNewQuizEntry.bind(this)} />
          </form>

          <div>
            <RaisedButton label="Continue"  
                          className="event-wizard-continue-button" 
                          primary={true}
                          onTouchTap={this.props.onDone.bind(null, this.props.eventId)} />
          </div>
        </div>  
      </div>
    );
  }
}

export default withRouter(QuizEntry);

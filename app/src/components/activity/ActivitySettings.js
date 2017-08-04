import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './ActivitySettings.css';

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
  toggle: {
    marginBottom: 16,
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
      event: {}
    };
  }

  componentDidMount() {
    this._getEvent();
  }

  _getEvent() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ event: res.data });
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _onToggleChange(e, checked) {
    this.state.event[e.currentTarget.dataset.value] = checked;
    this.setState({ event: this.state.event });

    var data = new URLSearchParams();
    for (var attr in this.state.event) {
      data.append(attr, this.state.event[attr]);
    }

    axios.put(this.state.url, data).catch(function(err) {
      this._getEvent();
      this._handleError(err);
    }.bind(this));
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

          <form className="activitySettins">
            <Toggle label="Chat highlight"
                    toggled={this.state.event.chat_highlight}
                    data-value="chat_highlight"
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>
            <Toggle label="Highlight chat with user image"
                    toggled={this.state.event.chat_with_user_image}
                    data-value="chat_with_user_image"
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>
            <Toggle label="Pose a question"
                    toggled={this.state.event.pose_question}
                    data-value="pose_question"
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>
            <Toggle label="Chat shown in status bar"
                    toggled={this.state.event.chat_shown_status_bar}
                    data-value="chat_shown_status_bar"
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>
            <Toggle label="Stage moment with webcam"
                    toggled={this.state.event.stage_moment_webcam}
                    data-value="stage_moment_webcam"
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>
          </form>

          <div>
            <RaisedButton label="Continue"
                          className="event-wizard-continue-button"
                          primary={true}
                          onTouchTap={this.props.onDone} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(QuizEntry);

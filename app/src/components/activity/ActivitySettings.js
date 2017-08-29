import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { blue600, blue100 } from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import SvgIcon from 'material-ui/SvgIcon';
import axios from 'axios';
import './ActivitySettings.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');

const styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  },
  toggle: {
    marginBottom: 16,
    fontSize: '1.15em',
    color: 'rgb(158, 158, 158)'
  },
  thumbSwitched: {
    backgroundColor: blue600
  },
  trackOff: {
    backgroundColor: blue100    
  }
};

class QuizEntry extends Component {
  constructor(props) {
    super(props);

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
      for (var i in res.data) {
        if (i.indexOf('_price') > -1) {
          res.data[i] = parseFloat(res.data[i] || 0).toFixed(2);
        }
      }

      this.setState({ event: res.data });
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _handleTextFieldChange(e) {
    this.state.event[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _onToggleChange(e, checked) {
    this.state.event[e.currentTarget.dataset.value] = checked;
    this.setState({ event: this.state.event });
    this._save();
  }

  _handleSave() {
    this._save();
  }

  _save() {
    var data = new FormData();
    for (var attr in this.state.event) {
      if (attr.indexOf('_price') > -1) {
        data.append(attr, this.state.event[attr] || 0);
      } else {
        data.append(attr, this.state.event[attr]);
      }
    }

    axios.put(this.state.url, data)
    .then(function() {
      this._getEvent();
    }.bind(this))
    .catch(function(err) {
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
      <div  key={this.state.count}>
        <ErrorReporting open={this.state.error !== null}
                  error={this.state.error} />

        <form className="activity-settings">
          <div>
            <Toggle label="Chat highlight"
                    className="toggle"
                    toggled={this.state.event.chat_highlight}
                    data-value="chat_highlight"
                    thumbSwitchedStyle={styles.thumbSwitched}
                    trackSwitchedStyle={styles.trackOff}
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>

            <TextField floatingLabelText="Price ($ USD)"
                        className="text-field"
                        data-val="chat_highlight_price"
                        primary={true}
                        value={this.state.event.chat_highlight_price}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
          </div>

          <div>
            <Toggle label="Highlight chat with user image"
                    className="toggle"
                    toggled={this.state.event.chat_with_user_image}
                    data-value="chat_with_user_image"
                    thumbSwitchedStyle={styles.thumbSwitched}
                    trackSwitchedStyle={styles.trackOff}
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>
            <TextField floatingLabelText="Price ($ USD)"
                      className="text-field"
                      data-val="chat_with_user_image_price"
                      primary={true}
                      value={this.state.event.chat_with_user_image_price}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
          </div>

          <div>
            <Toggle label="Pose a question"
                    className="toggle"
                    toggled={this.state.event.pose_question}
                    data-value="pose_question"
                    thumbSwitchedStyle={styles.thumbSwitched}
                    trackSwitchedStyle={styles.trackOff}
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>
            <TextField floatingLabelText="Price ($ USD)"
                      className="text-field"
                      data-val="pose_question_price"
                      primary={true}
                      value={this.state.event.pose_question_price}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
          </div>

          <div>
            <Toggle label="Chat shown in status bar"
                    className="toggle"
                    toggled={this.state.event.chat_shown_status_bar}
                    data-value="chat_shown_status_bar"
                    thumbSwitchedStyle={styles.thumbSwitched}
                    trackSwitchedStyle={styles.trackOff}
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>
            <TextField floatingLabelText="Price ($ USD)"
                      className="text-field"
                      data-val="chat_shown_status_bar_price"
                      primary={true}
                      value={this.state.event.chat_shown_status_bar_price}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
          </div>                  

          <div>        
            <Toggle label="Stage moment with webcam"
                    className="toggle"
                    toggled={this.state.event.stage_moment_webcam}
                    data-value="stage_moment_webcam"
                    thumbSwitchedStyle={styles.thumbSwitched}
                    trackSwitchedStyle={styles.trackOff}
                    onToggle={this._onToggleChange.bind(this)}
                    style={styles.toggle}/>

            <TextField floatingLabelText="Price ($ USD)"
                      className="text-field"
                      data-val="stage_moment_webcam_price"
                      primary={true}
                      value={this.state.event.stage_moment_webcam_price}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />                    
          </div>         

          <div>
            <RaisedButton label="Save"
                          className="event-wizard-continue-button"
                          primary={true}
                          onTouchTap={this._handleSave.bind(this)} />
          </div> 
        </form>
      </div>
    );
  }
}

export default withRouter(QuizEntry);

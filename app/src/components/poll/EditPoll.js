import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditPoll.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var styles = {
  screenHeight: {
    height: window.innerHeight - 250
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
        pathname: '/manager/event/edit/' + this.props.match.params.eventId,
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
    var data = new FormData();
    data.append('name', this.state.poll.name);
    data.append('description', this.state.poll.description);

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

            <RaisedButton label="Edit" fullWidth={true} onTouchTap={this._handleEditAdmission.bind(this)} />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditPoll);

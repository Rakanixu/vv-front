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
import './EditAuction.css';

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

class EditAuction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/auction/' + this.props.match.params.auctionId,
      auction: {}
    };
  }

  componentDidMount() {
    this._getAuction();
  }

  _getAuction() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ auction: res.data });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.auction[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handleEditAuction(e) {
    this._editAuction()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/event/edit/' + this.props.match.params.eventId + '/detail',
        query: {
          showTabs: true,
          index: 5
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editAuction() {
    if (this.state.auction.name === undefined || this.state.auction.name === '' ||
      this.state.auction.title === undefined || this.state.auction.title === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('name', this.state.auction.name);
    data.append('title', this.state.auction.title);
    data.append('description', this.state.auction.description || '');

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

          <form className="edit-acution">
            <Paper style={styles.paper}>
              <TextField floatingLabelText="Name"
                        data-val="name"
                        value={this.state.auction.name}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Title"
                        data-val="title"
                        value={this.state.auction.title}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        value={this.state.auction.description}
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <RaisedButton label="Edit" 
                            className="right margin-top-medium" 
                            primary={true} 
                            onTouchTap={this._handleEditAuction.bind(this)} />
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditAuction);

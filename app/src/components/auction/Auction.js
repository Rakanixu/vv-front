import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import AuctionList from './AuctionList';
import axios from 'axios';
import './Auction.css';

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

class Auction extends Component {
  constructor(props) {
    super(props);

    if (this.props.noFit) {
      delete styles.screenHeight.height;
    }

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

  _handleNewAuction(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    this._createAuction()
    .then(function(res) {
      var count = this.state.count;
      count++;

      this.setState({
        error: null,
        count: count,
        name: '',
        title: '',
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

  _createAuction() {
    if (this.state.name === undefined || this.state.name === '' ||
      this.state.title === undefined || this.state.title === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('name', this.state.name);
    data.append('title', this.state.title);
    data.append('description', this.state.description || '');

    return axios.post(this.state.url + this.props.eventId + '/auction', data);
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
            <AuctionList key={this.state.count} noEdit={true} eventId={this.props.eventId}/>
            : null }
        </div>    

        <div className={this.props.showNoEditListing ? "container new-auction-container" : "new-auction-container" } >
          <div className="title">
            <h1>New Auction</h1>
          </div>

          <form className="new-auction-form">
            <Paper style={styles.paper}>
              <TextField floatingLabelText="Name"
                        data-val="name"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Title"
                        data-val="title"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Description"
                        data-val="description"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <div className="overflow">
                <RaisedButton label="Save Auction" 
                              className="right margin-top-medium margin-left-medium"
                              primary={true}
                              onTouchTap={this._handleNewAuction.bind(this)} />
              </div>                
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Auction);

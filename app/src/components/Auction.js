import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import AuctionList from './AuctionList';
import axios from 'axios';
import './Auction.css';

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

    if (this.state.title === undefined || this.state.title === '') {
      this._handleError();
      return;
    }

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
    var data = new FormData();
    data.append('name', this.state.name);
    data.append('title', this.state.title);
    data.append('description', this.state.description);

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
      <div className="container" key={this.state.count} style={styles.screenHeight}>
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          { this.props.showNoEditListing ?
            <AuctionList key={this.state.count} noEdit={true} eventId={this.props.eventId}/>
            : null }

          <form className="newAuction">
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

            <RaisedButton label="Save Auction" fullWidth={true} onTouchTap={this._handleNewAuction.bind(this)} />
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

export default withRouter(Auction);

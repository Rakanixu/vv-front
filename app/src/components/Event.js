import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardActions, CardMedia, CardTitle } from 'material-ui/Card';
import  RaisedButton  from 'material-ui/RaisedButton';
import axios from 'axios';
import './Event.css';

const config = require('./../config.json');
var styles = {
  cardActions: {
    position: 'relative',
    bottom: '150',
    textAlign: 'center'
  },
  cardTitle: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0, 
    color: 'white',
    fontSize: '2.5em',
    margin: 'auto',
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: '#fff 0px 0px 6px',
    webkitFontSmoothing: 'antialiased'
  },
  cover: {
    height: window.innerHeight - 52, // footer height
    width: '100%'
  },
  fit: {
    maxHeight: window.innerHeight - 76, // footer height
    backgroundColor: '#e4e4e4'
  },
  raisedButton: {
    height: 60,
    maxWidth: '80%',
    minWidth: 250
  }
};

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId,
      event: {}
    };
  }

  componentDidMount() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ event: res.data });
    }.bind(this)).catch(err => {
      console.log('Error getting event', err);
    });
  }

  render() {
    return (
      <Card style={styles.fit}>
        <CardMedia style={styles.fit} >
          <img src={config.baseURL + this.state.event.event_background} style={styles.cover}/>
        </CardMedia>
        <CardTitle title={this.state.event.title} style={styles.cardTitle} />
        <CardActions style={styles.cardActions}>
          <RaisedButton style={styles.raisedButton} primary={true} label="Join Event" />
        </CardActions>
      </Card>
    );
  }
}

export default withRouter(Event);
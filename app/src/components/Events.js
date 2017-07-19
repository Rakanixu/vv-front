import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Box from'./Box.js';
import './Events.css';

const config = require('./../config.json');

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: config.baseAPI_URL + 'event',
      events: []
    };
  }

  componentDidMount() {
    axios.get(this.state.url).then(res => {
      this.setState({ events: res.data });
    }).catch(err => {
      console.log('Error getting events', err);
    });
  }

  render() {
    return (
      <div>
        {this.state.events.map((event, i) =>
          <div className="event" key={event.id}>
            <Box key={i} 
                 id={event.id} 
                 title={event.title} 
                 date={event.date} 
                 background={event.event_background} 
                 link="" />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Events);

import React, { Component } from 'react';
import axios from 'axios';
import './Event.css';
import Box from'./Box.js';

const config = require('./../config.json');

class Event extends Component {
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="content">
              <div className="row">
                <div className="col-md-8 col-md-offset-2">
                  <div className="row">
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
                </div>
              </div>
            </div>
          </div>
        </div>    
      </div>
    );
  }
}

export default Event;

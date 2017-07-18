import React, { Component } from 'react';
import config from './../config';
import axios from 'axios';
import './Event.css';
import Box from'./Box.js';

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:9000/api/v1/event',
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

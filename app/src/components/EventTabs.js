import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Nav from'./Nav.js';
import SliderImage from './SliderImage';
import Admissions from './Admissions';
import Polls from './Polls';
import QuestionTopic from './QuestionTopic';
import EventGuests from './EventGuests';
import Auction from './Auction';
import Quiz from './Auction';
import './EventTabs.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');

class EventTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: [
        {
          handleActive: this.handleTabChange.bind(this, 0),
          title: 'Slider'
        },
        {
          handleActive: this.handleTabChange.bind(this, 1),
          title: 'Admissions'
        },
        {
          handleActive: this.handleTabChange.bind(this, 2),
          title: 'Polls'
        },
        {
          handleActive: this.handleTabChange.bind(this, 3),
          title: 'Question Topics'
        },
        {
          handleActive: this.handleTabChange.bind(this, 4),
          title: 'Event Guests'
        },
        {
          handleActive: this.handleTabChange.bind(this, 5),
          title: 'Auctions'
        },
        {
          handleActive: this.handleTabChange.bind(this, 6),
          title: 'Quizzes'
        }
      ],
      show: [true, false, false, false, false, false, false],
      url: config.baseAPI_URL + '/event/' + this.props.eventId
    };
  }

  componentDidMount() {
    axios.get(this.state.url).then(res => {
      this.setState({ events: res.data });
    }).catch(err => {
      console.log('Error getting events', err);
    });
  }

  handleTabChange = (index) => {
    var show = [];
    for (var i = 0; i < this.state.tabs.length; i++) {
      if (i === index) {
        show.push(true);
      } else {
        show.push(false);
      }
    }
    this.setState({ show: show });
  }

  onDone = () => {

  }

  render() {
    return (
      <div>
        <Nav tabs={this.state.tabs} />
        { this.state.show[0] ? <SliderImage onDone={this.onDone} eventId={this.props.eventId}/>: null }
        { this.state.show[1] ? <Admissions onDone={this.onDone} eventId={this.props.eventId}/> : null }
        { this.state.show[2] ? <Polls onDone={this.onDone} eventId={this.props.eventId}/> : null }
        { this.state.show[3] ? <QuestionTopic onDone={this.onDone} eventId={this.props.eventId}/> : null } 
        { this.state.show[4] ? <EventGuests onDone={this.onDone} eventId={this.props.eventId}/> : null }
        { this.state.show[5] ? <Auction onDone={this.onDone} eventId={this.props.eventId}/> : null }
        { this.state.show[6] ? <Quiz onDone={this.onDone} eventId={this.props.eventId}/> : null }   
      </div>
    );
  }
}

export default withRouter(EventTabs);

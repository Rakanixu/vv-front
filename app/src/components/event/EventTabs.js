import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import EventPreview from '../event/EventPreview';
import Nav from'../nav/Nav.js';
import SliderImage from '../slider/SliderImage';
import SliderImageList from '../slider/SliderImageList';
import Admissions from '../admission/Admissions';
import AdmissionsList from '../admission/AdmissionsList';
import Polls from '../poll/Polls';
import PollsList from '../poll/PollsList';
import QuestionTopic from '../question-topic/QuestionTopic';
import QuestionTopicList from '../question-topic/QuestionTopicList';
import EventGuestsList from '../event-guest/EventGuestList';
import EventGuests from '../event-guest/EventGuests';
import Auction from '../auction/Auction';
import AuctionList from '../auction/AuctionList';
import Quiz from '../quiz/Quiz';
import QuizList from '../quiz/QuizList';
import QuizEntry from '../quiz/QuizEntry';
import QuizEntryList from '../quiz/QuizEntryList';
import ActivitySettings from '../activity/ActivitySettings';
import './EventTabs.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');

class EventTabs extends Component {
  constructor(props) {
    super(props);

    const time = new Date().getTime();
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
        },
        {
          handleActive: this.handleTabChange.bind(this, 7),
          title: 'Quiz Entries'
        },
        {
          handleActive: this.handleTabChange.bind(this, 8),
          title: 'Activity Settings'
        }
      ],
      show: [true, false, false, false, false, false, false, false, false],
      reloadSliderImageList: time + 'A',
      reloadAdmissionsList: time + 'B',
      reloadPollsList: time + 'C',
      reloadQuestionTopicList: time + 'D',
      reloadEventGuestsList: time + 'E',
      reloadAuctionList: time + 'F',
      reloadQuizList: time + 'G',
      reloadQuizEntryList: time + 'F',
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId
    };
  }

  componentWillMount() {
    this.handleTabChange(this.props.tabIndex ? this.props.tabIndex : 0);
  }

  componentDidMount() {
    axios.get(this.state.url).then(res => {
      this.setState({ events: res.data });
    }).catch(function(err) {
      this._handleError(err);
    }.bind(this));
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
    this.props.history.push('/manager/event');
  }

  onSave = (key) => {
    var state = {};
    state[key] = new Date().getTime();
    this.setState(state)
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
        <EventPreview />

        <div className="container">
          <div style={{overflow:'hidden'}}>
            <Nav tabs={this.state.tabs} tabIndex={this.props.tabIndex}/>
            { this.state.show[0] ?
              <div>
                <SliderImageList key={this.state.reloadSliderImageList} eventId={this.props.match.params.eventId}/>
                <SliderImage onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadSliderImageList')} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
            { this.state.show[1] ?
              <div>
                <AdmissionsList key={this.state.reloadAdmissionsList} eventId={this.props.match.params.eventId}/>
                <Admissions onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadAdmissionsList')} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
            { this.state.show[2] ?
              <div>
                <PollsList key={this.state.reloadPollsList} eventId={this.props.match.params.eventId}/>
                <Polls onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadPollsList')} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
            { this.state.show[3] ?
              <div>
                <QuestionTopicList key={this.state.reloadQuestionTopicList} eventId={this.props.match.params.eventId}/>
                <QuestionTopic onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadQuestionTopicList')} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
            { this.state.show[4] ?
              <div>
                <EventGuestsList key={this.state.reloadEventGuestsList} eventId={this.props.match.params.eventId}/>
                <EventGuests onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadEventGuestsList')} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
            { this.state.show[5] ?
              <div>
                <AuctionList key={this.state.reloadAuctionList} eventId={this.props.match.params.eventId}/>
                <Auction onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadAuctionList')} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
            { this.state.show[6] ?
              <div>
                <QuizList key={this.state.reloadQuizList} eventId={this.props.match.params.eventId}/>
                <Quiz onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadQuizList')} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
            { this.state.show[7] ?
              <div>
                <QuizEntryList key={this.state.reloadQuizEntryList} eventId={this.props.match.params.eventId}/>
                <QuizEntry onDone={this.onDone} onSave={this.onSave.bind(this, 'reloadQuizEntryList')} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
            { this.state.show[8] ?
              <div>
                <ActivitySettings onDone={this.onDone} eventId={this.props.match.params.eventId} noFit={true}/>
              </div>
              : null }
          </div>
        </div>  
      </div>
    );
  }
}

export default withRouter(EventTabs);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import NewEventWrapper from '../components/event/NewEventWrapper';
import EventsGridList from '../components/event/EventsGridList';
import EditEvent from '../components/event/EditEvent';
import EditSliderImage from '../components/slider/EditSliderImage';
import EditAdmission from '../components/admission/EditAdmission';
import EditQuestionTopic from '../components/question-topic/EditQuestionTopic';
import EditEventGuest from '../components/event-guest/EditEventGuest';
import EditPoll from '../components/poll/EditPoll';
import EditAuction from '../components/auction/EditAuction';
import EditQuiz from '../components/quiz/EditQuiz';
import EditQuizEntry from '../components/quiz/EditQuizEntry';
import Media from '../components/media/Media';
import NewMedia from '../components/media/NewMedia';
import Users from '../components/user/Users';
import NewUser from '../components/user/NewUser';
import EditUser from '../components/user/EditUser';
import Donations from '../components/donation/Donations';
import DesignOptions from '../components/design-option/DesignOptions';
import EventLocationList from '../components/event-location/EventLocationList';
import NewEventLocation from '../components/event-location/NewEventLocation';
import EditEventLocation from '../components/event-location/EditEventLocation';
import axios from 'axios';
import './Manager.css';

const config = require('./../config.json');
const utils = require('./../utils.js');
var user, principal = {};

class Manager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      url: config.baseAPI_URL + '/principal',
    };
  }

  componentWillMount() {
    if (!utils.IsManager()) {
      this.props.history.push('/');
    }

    if (localStorage.getItem('alantu-user')) {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }

    this._getPrincipal(user.principal_id);
  }

  _getPrincipal = (id) => {
    axios.get(this.state.url + '/' + id).then(res => {
      principal = res.data;
      utils.setBackground(config.baseURL + principal.background);
      utils.setLogo(config.baseURL + principal.logo);
    }).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  _handleClose = () => {
    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  _handleRedirect(e) {
    this.props.history.push(e.currentTarget.dataset.url);
    this.setState({ open: false });
  }

  _logout = (e) => {
    localStorage.clear();
    this.props.history.push('/login');
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
        <AppBar title="Manager"
                className="app-bar"
                iconElementRight={<FlatButton label="Logout" />}
                onRightIconButtonTouchTap={this._logout}
                onLeftIconButtonTouchTap={this._handleToggle}
                onTouchTap={this._handleClose}/>
        <Drawer open={this.state.open}>
          <div className="logo-container"><img id="principalLogo" className="logo" src="/logo.png" alt="logo"/></div>
          <MenuItem data-url="/manager/event" onTouchTap={this._handleRedirect.bind(this)}>Events overview</MenuItem>
          <MenuItem data-url="/manager/event/new" onTouchTap={this._handleRedirect.bind(this)}>New event</MenuItem>
          <MenuItem data-url="/manager/event_location" onTouchTap={this._handleRedirect.bind(this)}>Event locations</MenuItem>
          <MenuItem data-url="/manager/donations" onTouchTap={this._handleRedirect.bind(this)}>Donations</MenuItem>
          <MenuItem data-url="/manager/users" onTouchTap={this._handleRedirect.bind(this)}>Users</MenuItem>
          <MenuItem data-url="/manager/media" onTouchTap={this._handleRedirect.bind(this)}>Media</MenuItem>
          <MenuItem data-url="/manager/design_options" onTouchTap={this._handleRedirect.bind(this)}>Design options</MenuItem>
        </Drawer>
        <div className="manager-container">
          <Switch>
            <Route exact path={`${this.props.match.path}`} component={EventsGridList} />
            <Route exact path={`${this.props.match.path}/event`} component={EventsGridList} />
            <Route exact path={`${this.props.match.path}/event/new`} component={NewEventWrapper} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId`} component={EditEvent} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId/image/:imageId`} component={EditSliderImage} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId/admission/:admissionId`} component={EditAdmission} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId/poll/:pollId`} component={EditPoll} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId/question_topic/:questionTopicId`} component={EditQuestionTopic} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId/event_guest/:eventGuestId`} component={EditEventGuest} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId/auction/:auctionId`} component={EditAuction} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId/quiz/:quizId`} component={EditQuiz} />
            <Route exact path={`${this.props.match.path}/event/edit/:eventId/quiz/:quizId/quiz_entry/:quizEntryId`} component={EditQuizEntry} />
            <Route exact path={`${this.props.match.path}/event_location`} component={EventLocationList} />
            <Route exact path={`${this.props.match.path}/event_location/new`} component={NewEventLocation} />
            <Route exact path={`${this.props.match.path}/event_location/edit/:eventLocationId`} component={EditEventLocation} />
            <Route exact path={`${this.props.match.path}/media`} component={Media} />
            <Route exact path={`${this.props.match.path}/media/new`} component={NewMedia} />
            <Route exact path={`${this.props.match.path}/users`} component={Users} />
            <Route exact path={`${this.props.match.path}/users/new`} component={NewUser} />
            <Route exact path={`${this.props.match.path}/users/edit/:userId`} component={EditUser} />
            <Route exact path={`${this.props.match.path}/donations`} component={Donations} />
            <Route exact path={`${this.props.match.path}/design_options`} component={DesignOptions} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(Manager);
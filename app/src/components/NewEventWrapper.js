import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import NewEvent from './NewEvent';
import SliderImage from './SliderImage';
import Admissions from './Admissions';
import Polls from './Polls';
import QuestionTopic from './QuestionTopic';
import EventGuests from './EventGuests';
import Auction from './Auction';
import Quiz from './Quiz';
import QuizEntry from './QuizEntry';
import './NewEventWrapper.css';

const steps = 8;

class NewEventWrapper extends Component {
  state = {
    finished: false,
    stepIndex: 0,
    showComponent: [true, false, false, false, false, false, false, false]
  };

  _handleNext = (eventId) => {
    const {stepIndex, showComponent} = this.state;
    showComponent.move(stepIndex, stepIndex + 1);

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= steps,
      eventId: eventId,
      showComponent: showComponent
    });

    if (this.state.finished) {
      this.props.history.push('/manager/event/edit/' + this.state.eventId);
    }
  };

  _handlePrev = () => {
    const {stepIndex, showComponent} = this.state;
    showComponent.move(stepIndex, stepIndex - 1);

    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1,
        showComponent: showComponent
      });
    }
  };

  render() {
    const {finished, stepIndex, showComponent} = this.state;

    return (
      <div style={{width: '100%', margin: 'auto'}}>
        <Stepper activeStep={stepIndex} style={{width: '100%', margin: 'auto', background: '#e4e4e4'}}>
          <Step><StepLabel>Create event</StepLabel></Step>
          <Step><StepLabel>Add previews</StepLabel></Step>
          <Step><StepLabel>Add admissions</StepLabel></Step>
          <Step><StepLabel>Add polls</StepLabel></Step>
          <Step><StepLabel>Add question topics</StepLabel></Step>
          <Step><StepLabel>Add event guests</StepLabel></Step>
          <Step><StepLabel>Add auctions</StepLabel></Step>
          <Step><StepLabel>Add quizzes</StepLabel></Step>
          <Step><StepLabel>Add quiz entries</StepLabel></Step>
        </Stepper>
        <div>
          { showComponent[0] ? <NewEvent onDone={this._handleNext.bind(this)} /> : null }
          { showComponent[1] ? <SliderImage showNoEditListing={true} onDone={this._handleNext.bind(this)} eventId={this.state.eventId}/> : null }
          { showComponent[2] ? <Admissions showNoEditListing={true} onDone={this._handleNext.bind(this)} eventId={this.state.eventId}/> : null }
          { showComponent[3] ? <Polls showNoEditListing={true} onDone={this._handleNext.bind(this)} eventId={this.state.eventId}/> : null }
          { showComponent[4] ? <QuestionTopic showNoEditListing={true} onDone={this._handleNext.bind(this)} eventId={this.state.eventId}/> : null } 
          { showComponent[5] ? <EventGuests showNoEditListing={true} onDone={this._handleNext.bind(this)} eventId={this.state.eventId}/> : null }
          { showComponent[6] ? <Auction showNoEditListing={true} onDone={this._handleNext.bind(this)} eventId={this.state.eventId}/> : null }
          { showComponent[7] ? <Quiz showNoEditListing={true} onDone={this._handleNext.bind(this)} eventId={this.state.eventId}/> : null }
          { showComponent[8] ? <QuizEntry showNoEditListing={true} onDone={this._handleNext.bind(this)} eventId={this.state.eventId}/> : null }   
        </div>
      </div>
    );
  }
}

export default withRouter(NewEventWrapper);
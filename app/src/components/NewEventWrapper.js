import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import NewEvent from './NewEvent';
import './NewEventWrapper.css';

const config = require('./../config.json');

class NewEventWrapper extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    finished: false,
    stepIndex: 0,
  };

  _handleNext = () => {
    debugger;
    const {stepIndex} = this.state;

    switch (stepIndex) {
      case 0:
        
       // this.refs.NewEvent
        break;
    }

    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 8,
    });
  };

  _handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div style={{width: '100%', maxWidth: 1800, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step><StepLabel>Create event</StepLabel></Step>
          <Step><StepLabel>Add previews</StepLabel></Step>
          <Step><StepLabel>Add admissions</StepLabel></Step>
          <Step><StepLabel>Add polls</StepLabel></Step>
          <Step><StepLabel>Add question topics</StepLabel></Step>
          <Step><StepLabel>Add event guests</StepLabel></Step>
          <Step><StepLabel>Add auctions</StepLabel></Step>
          <Step><StepLabel>Add quizzes</StepLabel></Step>               
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false});
                }}
              >
                Click here
              </a> to reset the example.
            </p>
          ) : (
            <div>
              <NewEvent ref="newEvent"/>

              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={this._handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 8 ? 'Finish' : 'Next'}
                  primary={true}
                  onTouchTap={this._handleNext}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(NewEventWrapper);
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withRouter } from 'react-router-dom';
import ThemeDefault from '../theme-default';
import EventsGridList from '../components/event/EventsGridList';
import UnauthenticatedHeader from './../components/header/UnauthenticatedHeader';
import './Unauthenticated.css'

class Unauthenticated extends Component {
  render() {
    const styles = {
      header: {
        paddigBottom: 70,
        position: 'fixed',
        top: 0,
        overflow: 'hidden',
        maxHeight: 57
      }
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <UnauthenticatedHeader />

          <div className="unauthenticated-container">
            <EventsGridList isTemplate={false} authenticated={false}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Unauthenticated);

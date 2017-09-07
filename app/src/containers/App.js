import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ThemeDefault from '../theme-default';
import Login from './Login';
import Register from './Register';
import EventsGridList from '../components/event/EventsGridList';
import Root from './Root';
import Manager from './Manager';
import './App.css';

injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider muiTheme={ThemeDefault}>
          <div>
            <Switch>
              <Route exact path='/'>
                <EventsGridList isTemplate={false} authenticated={false}/>
              </Route>
              <Route exact path='/event'>
                <EventsGridList isTemplate={false} authenticated={false}/>
              </Route>
              <Route exact path='/event/:eventId'/>
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/root' component={Root} />
              <Route path='/manager' component={Manager} />
            </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;

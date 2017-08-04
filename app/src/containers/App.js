import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Events from '../components/event/Events';
import Event from '../components/event/Event';
import Login from './Login';
import Register from './Register';
import Root from './Root';
import Manager from './Manager';
import './App.css';

injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider /* muiTheme={lightBaseTheme} */>
          <div>
            <Switch>
              <Route exact path='/' component={Events} />
              <Route exact path='/event' component={Events} />
              <Route exact path='/event/:eventId' component={Event} />
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

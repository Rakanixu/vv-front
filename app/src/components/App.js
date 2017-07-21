import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Nav from './Nav';
import Events from './Events';
import Event from './Event';
import Login from './Login';
import Register from './Register';
import Root from './Root';
import Manager from './Manager';
import User from './User';
import Footer from './Footer';
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
              <Route path='/user' component={User} />
            </Switch>
            <Footer />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;

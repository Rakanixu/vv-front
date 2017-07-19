import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Nav from './Nav';
import Event from './Event';
import Login from './Login';
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
              <Route exact path='/' component={Event}/>
              <Route path='/event' component={Event}/>
              <Route path='/login' component={Login}/>
            </Switch>
            <Footer />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;

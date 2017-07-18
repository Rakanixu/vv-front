import React, { Component } from 'react';
import Nav from './Nav';
import Event from './Event';
import Footer from './Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />
        <Event />
        <Footer />
      </div>
    );
  }
}

export default App;

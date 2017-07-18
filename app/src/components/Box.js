import React, { Component } from 'react';
import Nav from './Nav';
import Event from './Event';
import Footer from './Footer';
import './App.css';

class Box extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)

    this.setState({outerStyle: {
      backgroundImage: 'url(' + this.props.background + ')'
    }});
  }

  render() {
    return (
      <div className="event" style={this.props.outerStyle}>
        <a href="/events/589874ef39e00104f8976810"></a>
        <div className="info">
          <a href={this.props.link}>
          <div className="title">{this.props.title}</div>
          <div className="date">{this.props.date}</div>
          </a>
          <a className="btn btn-lg btn-primary btn-join" href={this.props.link}>Show event details</a>
        </div>
      </div>
    );
  }
}

export default Box;

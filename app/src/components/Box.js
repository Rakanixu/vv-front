import React, { Component } from 'react';
import Nav from './Nav';
import Event from './Event';
import Footer from './Footer';
import './App.css';

const config = require('./../config.json');
var divStyle;

class Box extends Component {
  constructor(props) {
    super(props);

    divStyle = {
      background: 'url(' + config.baseURL + this.props.background + ')',
    };
  }

  render() {
    return (
      <div className="event" style={divStyle}>
        <a href={"/event/" + this.props.id}></a>
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

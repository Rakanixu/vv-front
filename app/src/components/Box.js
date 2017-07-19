import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import './Box.css';

const config = require('./../config.json');
var imgURL, cardStyle, cardMediaStyle;

class Box extends Component {
  constructor(props) {
    super(props);
    
    imgURL = config.baseURL + this.props.background;
    cardMediaStyle = {
      minHeight: 250,
      minWidth: 280,
      cursor: 'pointer'
    };
    cardStyle = {
      padding: 25
    };
  }

  redirect(e) {
    this.props.history.push('/event/' + this.props.id);
  }

  render() {
    return (
      <Card style={cardStyle} onTouchTap={this.redirect.bind(this)}>
        <CardMedia style={cardMediaStyle} overlay={<CardTitle title={this.props.title} subtitle={this.props.date} />}>
          <img src={imgURL} />
        </CardMedia>
      </Card>
    );
  }
}

export default withRouter(Box);
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import SliderImageList from './SliderImageList';
import ImgSelectionWrapper from '../image/ImgSelectionWrapper';
import axios from 'axios';
import './SliderImage.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');

var styles = {
  paperLeft: {
    padding: 20,
    overflow: 'auto',
    width: '50%',
    float: 'left',
    minWidth: 220,
    marginRight: 40,
    height: 'min-content'
  },
  paperRight: {
    padding: 20,
    overflow: 'auto',
    width: '50%',
    float: 'left',
    minWidth: 150,
    height: 'min-content'
  }
};

class SliderImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      count: 0,
      img: ''
    };
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _imageChange(img) {
    this.setState({ img: img });
  }

  _handleNewSliderImage(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    this._createSliderImage();
  }

  _createSliderImage() {
    if (this.state.img === undefined) {
      this._handleError();
      return;
    }

    var data = new FormData();
    data.append('title', this.state.title || '');
    data.append('type', this.state.type || '');
    data.append('img', this.state.img);

    axios.post(config.baseAPI_URL + '/event/' + this.props.eventId + '/image', data).then(function(res) {
      var count = this.state.count;
      count++;

      this.setState({
        error: null,
        img: {},
        count: count,
        title: '',
        type: ''
      });

      if (this.props.onSave) {
        this.props.onSave();
      }
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _handleError(err) {
    if (!err) {
      err = new Error('Invalid data');
    }

    this.setState({
      error: err
    });

    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);
  }

  render() {
    return (
      <div>
        <div className="container" key={this.state.count} >
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          { this.props.showNoEditListing ?
            <SliderImageList key={this.state.count} noEdit={true} eventId={this.props.eventId}/>
            : null }
        </div>  

        <div className={this.props.showNoEditListing ? "container new-image-container" : "new-image-container" } >
          <div className="title">
            <h1>New Slider Image</h1>
          </div>  

          <form className="new-slider-image">
            <Paper style={styles.paperLeft}>
              <TextField floatingLabelText="Title"
                        data-val="title"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />
              <TextField floatingLabelText="Type"
                        data-val="type"
                        onChange={this._handleTextFieldChange.bind(this)}
                        fullWidth={true} />

              <div className="overflow">
                <RaisedButton label="Save" 
                              className="right margin-top-medium" 
                              primary={true}
                              onTouchTap={this._handleNewSliderImage.bind(this)} />
              </div>

              <div className="overflow">
                <RaisedButton label="Continue" 
                              className="right margin-top-medium" 
                              primary={true} 
                              onTouchTap={this.props.onDone.bind(null, this.props.eventId)} />
              </div>          
            </Paper>            

            <Paper style={styles.paperRight}>
              <ImgSelectionWrapper onChange={this._imageChange.bind(this)}/>
            </Paper>  
          </form>
        </div>  
      </div>
    );
  }
}

export default withRouter(SliderImage);

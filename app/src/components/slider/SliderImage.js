import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import SliderImageList from './SliderImageList';
import axios from 'axios';
import './SliderImage.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');

var styles = {
   root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  gridTile: {
    cursor: 'pointer',
    width: 240
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  },
  screenHeight: {
    height: window.innerHeight - 250
  },
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

    if (this.props.noFit) {
      delete styles.screenHeight.height;
    }

    this.state = {
      error: null,
      count: 0,
      openDialog: false,
      img: {},
      imgUrlFromGallery: '',
      media: []
    };
  }

  componentWillMount() {
    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _handleOnClickUpload(e) {
    this.refs.galleryPreview.style.display = 'none';
    this.refs.uploadPreview.style.display = 'block';
    // hack
    document.querySelector('.fit input[type="file"]').click();
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _onImgChange = (pictures) => {
    this.setState({ img: pictures });
  }

  _handelImgSelect = (e) => {
    this.setState({
      imgUrlFromGallery: e.currentTarget.dataset.url
    });
    this._handleDialogClose();
  }

  _handleDialogOpen = () => {
    this.refs.uploadPreview.style.display = 'none';
    this.refs.galleryPreview.style.display = 'block';
    this.setState({ openDialog: true });
  };

  _handleDialogClose = () => {
    this.setState({openDialog: false});
  };

  _handleNewSliderImage(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    this._createSliderImage()
    .then(function(res) {
      var count = this.state.count;
      count++;

      this.setState({
        error: null,
        img: {},
        imgUrlFromGallery: '',
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

  _createSliderImage() {
    var img;
    for (var i in this.state.img) {
      img = this.state.img[i];
      break;
    }

    try {
      img = dataURItoBlob(img);
    } catch (err) {}

    if (this.state.imgUrlFromGallery !== '' && this.state.imgUrlFromGallery!== undefined) {
      img = this.state.imgUrlFromGallery;
    }

    var data = new FormData();
    data.append('title', this.state.title);
    data.append('type', this.state.type);
    data.append('img', img);

    return axios.post(config.baseAPI_URL + '/event/' + this.props.eventId + '/image', data);
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

            <Dialog title="Gallery"
                    modal={false}
                    open={this.state.openDialog}
                    onRequestClose={this._handleDialogClose}
                    autoScrollBodyContent={true}>
              <div style={styles.root}>
                <GridList style={styles.gridList} cols={2.2}>
                  {this.state.media.map((img, i) => (
                    <GridTile
                      key={i}
                      data-url={img.url}
                      style={styles.gridTile}
                      onTouchTap={this._handelImgSelect.bind(this)}
                      titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)">
                      <img src={config.baseURL + img.url} alt="gallery item"/>
                    </GridTile>
                  ))}
                </GridList>
              </div>
            </Dialog>

            <Paper style={styles.paperRight}>
              <div ref="galleryPreview">
              { this.state.imgUrlFromGallery!== undefined && this.state.imgUrlFromGallery.length > 0 ?
                <img src={config.baseURL + this.state.imgUrlFromGallery} alt="gallery item" />
                : null }
              </div>  

              <div className="fit hidelabel" ref="uploadPreview" style={{display: 'none'}}>
                <UploadPreview label="Add" onChange={this._onImgChange} style={styles.fit}/>
              </div>  

              <div className="overflow">
                <RaisedButton label="Select image from gallery"
                              className="right margin-top-medium margin-left-medium" 
                              primary={true}
                              onTouchTap={this._handleDialogOpen.bind(this)} />

                <RaisedButton label="Select Image from local storage"
                              className="right margin-top-medium margin-left-medium" 
                              primary={true}
                              onTouchTap={this._handleOnClickUpload.bind(this)} />
              </div>
            </Paper>  
          </form>
        </div>  
      </div>
    );
  }
}

export default withRouter(SliderImage);

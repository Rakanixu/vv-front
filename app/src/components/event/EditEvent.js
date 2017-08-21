import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import EventTabs from './EventTabs';
import axios from 'axios';
import './EditEvent.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const moment = require('moment');

var user = {};
var styles = {
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
    maxHeight: 250
  },
  paperLeft: {
    padding: 20,
    overflow: 'auto',
    width: '66%',
    float: 'left',
    minWidth: 220,
    marginRight: 40,
    height: 'min-content'
  },
  paperRight: {
    padding: 20,
    overflow: 'auto',
    width: '33%',
    float: 'left',
    minWidth: 150,
    height: 'min-content'
  }
};

class EditEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      openDialog: false,
      showPreviewImg: true,
      showEventBackground: true,
      showTabs: false,
      tabIndex: 0,
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId,
      preview_img: {},
      event_background: {},
      event: {},
      media: []
    };
  }

  componentWillMount() {
    if (this.props.location.query) {
      this.setState({
        showTabs: this.props.location.query.showTabs,
        tabIndex: this.props.location.query.index ? this.props.location.query.index : 0
      });
    }

    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
    this._getEvent();
  }

  _handleDialogOpen = (e) => {
    if (e.currentTarget.dataset.target === 'previewImgUrlFromGallery') {
      this.refs.uploadPreviewImg.style.display = 'none';
      this.refs.galleryPreviewImg.style.display = 'block';
    } else if (e.currentTarget.dataset.target === 'eventBackgroundUrlFromGallery') {
      this.refs.uploadEventBackground.style.display = 'none';
      this.refs.galleryEventBackground.style.display = 'block';
    }
    
    this.setState({ 
      imgTarget: e.currentTarget.dataset.target,
      openDialog: true 
    });
  };

  _handleDialogClose = () => {
    this.setState({openDialog: false});
  };

  _getEvent() {
    axios.get(this.state.url).then(function(res) {
      res.data.date = new Date(res.data.date);
      this.setState({ 
        event: res.data,
        eventBackgroundUrlFromGallery: res.data.event_background,
        previewImgUrlFromGallery: res.data.preview_img
      });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.event[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handleOnClickUploadPreviewImg(e) {
    this.refs.galleryPreviewImg.style.display = 'none';
    this.refs.uploadPreviewImg.style.display = 'block';
    // hack
    document.querySelector('.fit.preview-img input[type="file"]').click();
  }

  _handleOnClickUploadEventBackground(e) {
    this.refs.galleryEventBackground.style.display = 'none';
    this.refs.uploadEventBackground.style.display = 'block';
    // hack
    document.querySelector('.fit.event-background input[type="file"]').click();
  }

  _handelImgSelect = (e) => {
    let obj = {}
    obj[this.state.imgTarget] = e.currentTarget.dataset.url;

    this.setState(obj);
    this._handleDialogClose();
  }

  _handleDateChange = (nil, date) => {
    this.state.event.date = date;
    this.setState({ event: this.state.event });
  }

  _handleLoginRequired = (e, checked) => {
    this.state.event.login_required = !this.state.event.login_required;
    this.setState({ event: this.state.event });
  }

  _onPreviewImgChange = (pictures) => {
    this.setState({
      preview_img: pictures,
      showPreviewImg: false
    });
  }

  _onEventBackgroundChange = (pictures) => {
    this.setState({
      event_background: pictures,
      showEventBackground: false
    });
  }

  _handleEditEvent(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.event.title === undefined || this.state.event.title === "") {
      this._handleError();
      return;
    }

    this._editEvent()
    .then(function(res) {
      this.setState({
        showTabs: true,
        tabIndex: 0
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editEvent() {
    var preview_img, event_background;
    for (var i in this.state.preview_img) {
      preview_img = this.state.preview_img[i];
      break;
    }

    for (var i in this.state.event_background) {
      event_background = this.state.event_background[i];
      break;
    }

    try {
      preview_img = dataURItoBlob(preview_img);
      event_background = dataURItoBlob(event_background);
    } catch (err) {}

    if (!preview_img) {
      preview_img = this.state.previewImgUrlFromGallery || this.state.event.preview_img;
    }

    if (!event_background) {
      event_background = this.state.eventBackgroundUrlFromGallery || this.state.event.event_background;
    }

    var now = moment().utc(new Date()).format();
    var date = new Date(this.state.event.date);
    var data = new FormData();
    data.append('title', this.state.event.title);
    data.append('notes', this.state.event.notes);
    data.append('location', this.state.event.location);
    data.append('created_at', this.state.event.created_at);
    data.append('updated_at', now);
    data.append('date', moment(date).utc().format());
    data.append('login_required', this.refs.checkbox.state.switched);
    data.append('principal_id', user.principal_id);
    data.append('user_account_id', user.id);
    data.append('event_type_id', config.event_types.default.id);
    data.append('preview_img', preview_img);
    data.append('event_background', event_background);

    return axios.put(this.state.url, data);
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
      <div className="container">
        <div className="inner-container">
          { !this.state.showTabs ?
            <div>
              <ErrorReporting open={this.state.error !== null}
                        error={this.state.error} />

              <form className="edit-event-form">
                <Paper style={styles.paperLeft}>
                  <TextField floatingLabelText="Event title"
                            data-val="title"
                            value={this.state.event.title}
                            onChange={this._handleTextFieldChange.bind(this)}
                            fullWidth={true} />
                  <TextField floatingLabelText="Notes"
                            data-val="notes"
                            value={this.state.event.notes}
                            onChange={this._handleTextFieldChange.bind(this)}
                            fullWidth={true} />
                  <TextField floatingLabelText="Location"
                            data-val="location"
                            value={this.state.event.location}
                            onChange={this._handleTextFieldChange.bind(this)}
                            fullWidth={true} />
                  <DatePicker hintText="Date"
                            mode="landscape"
                            fullWidth={true}
                            value={this.state.event.date}
                            onChange={this._handleDateChange.bind(this)}/>
                  <div className="checkbox">
                    <Checkbox ref="checkbox"
                            checked={this.state.event.login_required}
                            onCheck={this._handleLoginRequired}
                            label="Login required?"/>
                  </div>

                  <div>
                    <RaisedButton label="Save & Continue"
                                  className="event-wizard-continue-button"
                                  primary={true}
                                  onTouchTap={this._handleEditEvent.bind(this)} />
                  </div>
                </Paper>

                <Paper style={styles.paperRight}>
                  <label className="load-img-label">Preview Image</label>
                  <div ref="galleryPreviewImg" className="margin-bottom-medium">
                  { this.state.showPreviewImg ? <img className="preview-img" src={config.baseURL + this.state.previewImgUrlFromGallery} alt="preview"/> : null }
                  </div>  

                  <div className="fit hidelabel preview-img" ref="uploadPreviewImg" style={{display: 'none'}}>
                    <UploadPreview label="Add" onChange={this._onPreviewImgChange} style={styles.fit}/>
                  </div>  

                  <div className="overflow">
                    <RaisedButton label="Select image from gallery"
                                  className="right margin-top-medium margin-left-medium" 
                                  primary={true}
                                  data-target="previewImgUrlFromGallery"
                                  onTouchTap={this._handleDialogOpen.bind(this)} />

                    <RaisedButton label="Select Image from local storage"
                                  className="right margin-top-medium margin-left-medium" 
                                  primary={true}
                                  onTouchTap={this._handleOnClickUploadPreviewImg.bind(this)} />
                  </div>

                  <label className="load-img-label margin-top-medium block">Background Image</label>
                  <div ref="galleryEventBackground" className="margin-bottom-medium">
                  { this.state.showEventBackground ? <img className="preview-img" src={config.baseURL + this.state.eventBackgroundUrlFromGallery} alt="preview"/> : null }
                  </div>  

                  <div className="fit hidelabel event-background" ref="uploadEventBackground" style={{display: 'none'}}>
                    <UploadPreview label="Add" onChange={this._onEventBackgroundChange} style={styles.fit}/>
                  </div>  

                  <div className="overflow">
                    <RaisedButton label="Select image from gallery"
                                  className="right margin-top-medium margin-left-medium" 
                                  primary={true}
                                  data-target="eventBackgroundUrlFromGallery"
                                  onTouchTap={this._handleDialogOpen.bind(this)} />

                    <RaisedButton label="Select Image from local storage"
                                  className="right margin-top-medium margin-left-medium" 
                                  primary={true}
                                  onTouchTap={this._handleOnClickUploadEventBackground.bind(this)} />
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
              </form>
            </div>
          : <EventTabs eventId={this.props.match.params.eventId} tabIndex={this.state.tabIndex}/> }
        </div>
      </div>
    );
  }
}

export default withRouter(EditEvent);

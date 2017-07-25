import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from './../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import EventTabs from './EventTabs';
import axios from 'axios';
import './EditSliderImage.css';

axios.defaults.withCredentials = true; 

const config = require('./../config.json');
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
  }
};

class EditAdmission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      showImg: true,
      iconUrlFromGallery: '',
      icon: {},
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/admission/' + this.props.match.params.admissionId,
      admission: {},
      media: []
    };
  }

  componentDidMount() {
    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });

    this._getAdmission();
  }

  _getAdmission() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ 
        admission: res.data,
        iconUrlFromGallery: res.data.icon
      });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.admission[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _onIconChange = (pictures) => {
    this.setState({ 
      icon: pictures,
      showImg: false      
    });
  }

  _handleEditAdmission(e) {
    this._editAdmission()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/event/edit/' + this.props.match.params.eventId,
        query: {
          showTabs: true,
          index: 1
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editAdmission() {
    var icon;
    for (var i in this.state.icon) {
      icon = this.state.icon[i];
      break;
    }

    try {
      icon = dataURItoBlob(icon);
    } catch (err) {}

    if (!icon) {
      icon = this.state.iconUrlFromGallery;
    }

    var data = new FormData();
    data.append('title', this.state.admission.title);
    data.append('subtitle', this.state.admission.subtitle);
    data.append('price', this.state.admission.price);
    data.append('description', this.state.admission.description);
    data.append('icon', icon);

    return axios.put(this.state.url, data);
  }

  _handleDialogOpen = () => {
    this.setState({ openDialog: true });
  }

  _handleDialogClose = () => {
    this.setState({openDialog: false});
  }

  _handelImgSelect = (e) => {
    this.setState({
      iconUrlFromGallery: e.currentTarget.dataset.url
    });
    this._handleDialogClose();
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
      <div className="container" style={styles.screenHeight}>
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <form className="editSliderImage">
            <TextField floatingLabelText="Title" 
                      data-val="title"
                      value={this.state.admission.title}
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Subtitle"
                      data-val="subtitle"
                      value={this.state.admission.subtitle}
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Price"
                      data-val="price"
                      value={this.state.admission.price}
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />                      
            <TextField floatingLabelText="Description"
                      data-val="description"
                      value={this.state.admission.description}
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />     

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
            { this.state.iconUrlFromGallery !== undefined && this.state.iconUrlFromGallery.length > 0 ?
              <img className="img-preview" src={config.baseURL + this.state.iconUrlFromGallery} alt="gallery item" />
              : null }
            <RaisedButton label="Select image from gallery" fullWidth={true} onTouchTap={this._handleDialogOpen.bind(this)} />
            <div className="fit">
              <UploadPreview title="Image" label="Add" onChange={this._onImgChange} style={styles.fit}/>  
            </div>

            <RaisedButton label="Save" fullWidth={true} onTouchTap={this._handleEditAdmission.bind(this)} />
          </form>
        </div>  
      </div>
    );
  }
}

export default withRouter(EditAdmission);

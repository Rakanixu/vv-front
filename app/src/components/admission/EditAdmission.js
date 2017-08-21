import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditAdmission.css';

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

  _handleOnClickUpload(e) {
    this.refs.galleryPreview.style.display = 'none';
    this.refs.uploadPreview.style.display = 'block';
    // hack
    document.querySelector('.fit input[type="file"]').click();
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

  _onImgChange = (pictures) => {
    this.setState({
      icon: pictures,
      showImg: false
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
      <div className="container" style={styles.screenHeight}>
        <div className="inner-container">
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />

          <form className="edit-admission">
            <Paper style={styles.paperLeft}>
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

              <RaisedButton label="Edit" 
                            className="right margin-top-medium" 
                            primary={true} 
                            onTouchTap={this._handleEditAdmission.bind(this)} />                        
            </Paper>

            <Paper style={styles.paperRight}>
              <div ref="galleryPreview">
                { this.state.iconUrlFromGallery!== undefined && this.state.iconUrlFromGallery.length > 0 ?
                  <img src={config.baseURL + this.state.iconUrlFromGallery} alt="gallery item" />
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
      </div>
    );
  }
}

export default withRouter(EditAdmission);

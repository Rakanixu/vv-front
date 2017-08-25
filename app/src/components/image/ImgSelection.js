import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import { GridList, GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import axios from 'axios';
import './ImgSelection.css';

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
  }
};

class ImgSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialog: false,
      selectedImage: this.props.defaultImage || '',
      upload_img: {},
      media: []
    };
  }

  componentWillMount() {
    this._getMedias();
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.defaultImage !== prevProps.defaultImage && this.props.defaultImage) {
      this.setState({ selectedImage: this.props.defaultImage });
    }

    if (this.props.value !== prevProps.value && this.props.value) {
      this.setState({ selectedImage: this.props.value });
    }

    if (this.state.selectedImage !== prevState.selectedImage) {
      this.props.onChange(this.state.selectedImage);
    }
  }

  _handleDialogOpen = (e) => {
    this.setState({
      openDialog: true
    });
  };

  _handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  _handleImgSelect = (e) => {
    this.setState({ selectedImage: e.currentTarget.dataset.url });
    this._handleDialogClose();
  }

  _onUploadImgChange = () => {
    this.setState({ upload_img: this.refs.uploadFile.files[0] });
    this._createMedia(this.refs.uploadFile.files[0]).then(function (data) {
      this._handleDialogClose();
      this.setState({ selectedImage: data.data.url });
      this._getMedias();
    }.bind(this)).catch(function (err) {
      this._handleError(err);
    }.bind(this));
  }

  _selectLocalImg = (e) => {
    this.refs.uploadFile.click();
  }

  _getMedias() {
    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _createMedia(file) {
    return new Promise(function(resolve, reject) { 
      try {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          var data = new FormData();
          data.append('url', dataURItoBlob(e.target.result));
    
          axios.post(config.baseAPI_URL + '/media', data).then(function(data) {
            resolve(data);
          }).catch(function(err) {
            reject(err); 
          }); 
        };
      } catch (err) { 
        reject(err); 
      }
    });
  }

  _handleError(err) {
    if (!err) {
      err = new Error('Invalid data');
    }

    this.setState({
      error: err
    });

    setTimeout(function () {
      this.setState({ error: null });
    }.bind(this), 5000);
  }

  render() {
    return (
      <div style={{ width: '100%', overflow: 'auto' }}>
        <div className="img-selection">
          <div ref="gallery">
            {this.state.selectedImage !== undefined && this.state.selectedImage.length > 0 ?
              <img className="preview" src={config.baseURL + this.state.selectedImage} alt="" />
              : null}
          </div>

          <div className="fit hidelabel preview-img" ref="upload" style={{ display: 'none' }}>
            <input id="fileUpload" type="file" ref="uploadFile" style={{ display: 'none' }} onChange={this._onUploadImgChange.bind(this)} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <RaisedButton label="Select Image"
              primary={true}
              onTouchTap={this._handleDialogOpen.bind(this)} />
          </div>

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
                    onTouchTap={this._handleImgSelect.bind(this)}
                    titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)">
                    <img src={config.baseURL + img.url} alt="gallery item" />
                  </GridTile>
                ))}
              </GridList>
              <RaisedButton label="Upload New Media"
                            className="add-media" 
                            primary={true}
                            onTouchTap={this._selectLocalImg.bind(this)} />
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default withRouter(ImgSelection);

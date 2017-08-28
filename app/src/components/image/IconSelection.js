import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import { GridList, GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import axios from 'axios';
import './IconSelection.css';

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

class IconSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialog: false,
      selectedIcon: this.props.defaultIcon || window.location.origin + config.icons[0],
      upload_icon: {},
      icons: config.icons
    };

    this.props.onChange(this.state.selectedIcon);
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.defaultIcon !== prevProps.defaultIcon && this.props.defaultIcon) {
      this.setState({ selectedIcon: this.props.defaultIcon });
    }

    if (this.props.value !== prevProps.value && this.props.value) {
      this.setState({ selectedIcon: this.props.value });
    }

    if (this.state.selectedIcon !== prevState.selectedIcon) {
      this.props.onChange(this.state.selectedIcon);
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

  _handleIconSelect = (e) => {
    this.setState({ selectedIcon: e.currentTarget.dataset.url });
    this._handleDialogClose();
  }

  _onUploadIconChange = () => {
    this.setState({ upload_icon: this.refs.uploadFile.files[0] });
    this._createMedia(this.refs.uploadFile.files[0]).then(function (data) {
      this._handleDialogClose();
      this.setState({ selectedIcon: data.data.url });
      this._getMedias();
    }.bind(this)).catch(function (err) {
      this._handleError(err);
    }.bind(this));
  }

  _selectLocalIcon = (e) => {
    this.refs.uploadFile.click();
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
        <div className="img-selection transparent-icon-background">
          <div ref="gallery">
            {this.state.selectedIcon !== undefined && this.state.selectedIcon.length > 0 ?
              <img className="preview" src={this.state.selectedIcon} alt="" />
              : null}
          </div>

          <div className="fit hidelabel preview-img" ref="upload" style={{ display: 'none' }}>
            <input id="fileUpload" 
                   type="file" 
                   ref="uploadFile" 
                   style={{ display: 'none' }} 
                   onChange={this._onUploadIconChange.bind(this)} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <RaisedButton label="Select Icon"
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
                {this.state.icons.map((url, i) => (
                  <GridTile
                    className="transparent-icon-background"
                    key={i}
                    data-url={window.location.origin + url}
                    style={styles.gridTile}
                    onTouchTap={this._handleIconSelect.bind(this)}
                    titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)">
                    <img src={window.location.origin + url} alt="icon" />
                  </GridTile>
                ))}
              </GridList>
{/*               <RaisedButton label="Upload New Icon"
                            className="add-media" 
                            primary={true}
                            onTouchTap={this._selectLocalIcon.bind(this)} /> */}
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default withRouter(IconSelection);

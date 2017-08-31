import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import ImgSelectionWrapper from '../image/ImgSelectionWrapper';
import axios from 'axios';
import './EditSliderImage.css';

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

class EditSliderImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      img: '',
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/image/' + this.props.match.params.imageId,
      image: {}
    };
  }

  componentDidMount() {
    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });

    this._getImage();
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getImage() {
    axios.get(this.state.url).then(function(res) {
      this.setState({
        image: res.data,
        imgUrlFromGallery: res.data.img
      });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.image[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _imageChange(img) {
    this.setState({ img: img });
  }

  _handleEditImage(e) {
    this._editImage()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/' + this._getType() + '/edit/' + this.props.match.params.eventId + '/detail',
        query: {
          showTabs: true,
          index: 0
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editImage() {
    var data = new FormData();
    data.append('title', this.state.image.title || '');
    data.append('type', this.state.image.type || '');
    data.append('img', this.state.img || this.state.image.url);

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
      imgUrlFromGallery: e.currentTarget.dataset.url
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
      <div className="container">
        <ErrorReporting open={this.state.error !== null}
                  error={this.state.error} />

        <form className="edit-slider-image">
          <Paper style={styles.paperLeft}>
            <TextField floatingLabelText="Title"
                      data-val="title"
                      value={this.state.image.title}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Type"
                      data-val="type"
                      value={this.state.image.type}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />

          <RaisedButton label="Edit" 
                        className="right margin-bottom-medium" 
                        primary={true}
                        onTouchTap={this._handleEditImage.bind(this)} />          
          </Paper>

          <Paper style={styles.paperRight}>
            <ImgSelectionWrapper onChange={this._imageChange.bind(this)} defaultImage={this.state.image.img}/>
          </Paper>  
        </form>
      </div>
    );
  }
}

export default withRouter(EditSliderImage);

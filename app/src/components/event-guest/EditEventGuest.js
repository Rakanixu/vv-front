import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditEventGuest.css';

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
    height: window.innerHeight - 180
  }
};

class EditEventGuest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      showImg: true,
      mainMediaUrlFromGallery: '',
      main_media: {},
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/named_guest/' + this.props.match.params.eventGuestId,
      event_guest: {},
      media: []
    };
  }

  componentDidMount() {
    axios.get(config.baseAPI_URL + '/media').then(res => {
      this.setState({ media: res.data });
    }).catch(err => {
      this._handleError(err);
    });

    this._getEventGuest();
  }

  _getEventGuest() {
    axios.get(this.state.url).then(function(res) {
      this.setState({
        event_guest: res.data,
        mainMediaUrlFromGallery: res.data.main_media
      });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.event_guest[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _onIconChange = (pictures) => {
    this.setState({
      main_media: pictures,
      showImg: false
    });
  }

  _handleMediaTypeChange = (e, index, val) => {
    this.state.event_guest.main_media_type_id = val;
    this.setState({ event_guest: this.state.event_guest });
  }

  _handleEditEventGuest(e) {
    this._editEventGuest()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/event/edit/' + this.props.match.params.eventId,
        query: {
          showTabs: true,
          index: 4
        }
      });
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _editEventGuest() {
    var main_media;
    for (var i in this.state.main_media) {
      main_media = this.state.main_media[i];
      break;
    }

    try {
      main_media = dataURItoBlob(main_media);
    } catch (err) {}

    if (!main_media) {
      main_media = this.state.mainMediaUrlFromGallery;
    }

    var data = new FormData();
    data.append('main_media_type_id', this.state.event_guest.main_media_type_id);
    data.append('name', this.state.event_guest.name);
    data.append('description', this.state.event_guest.description);
    data.append('main_media_file', this.state.event_guest.main_media_file);
    data.append('main_media', main_media);

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
      mainMediaUrlFromGallery: e.currentTarget.dataset.url
    });
    this._handleDialogClose();
  }

  _onImgChange = (pictures) => {
    this.setState({
      main_media: pictures,
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

          <form className="editSliderImage">
            <TextField floatingLabelText="Name"
                      data-val="name"
                      value={this.state.event_guest.name}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Description"
                      data-val="description"
                      value={this.state.event_guest.description}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />

            <SelectField floatingLabelText="Media type"
                         fullWidth={true}
                         value={this.state.event_guest.main_media_type_id}
                         onChange={this._handleMediaTypeChange}>
              {config.name_guest_media_type.map((type) => (
                <MenuItem value={type.id} primaryText={type.name} />
              ))}
            </SelectField>

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
            { this.state.mainMediaUrlFromGallery !== undefined && this.state.mainMediaUrlFromGallery.length > 0 ?
              <img className="img-preview" src={config.baseURL + this.state.mainMediaUrlFromGallery} alt="gallery item" />
              : null }
            <RaisedButton label="Select image from gallery" fullWidth={true} onTouchTap={this._handleDialogOpen.bind(this)} />
            <div className="fit">
              <UploadPreview title="Image" label="Add" onChange={this._onImgChange} style={styles.fit}/>
            </div>

            <RaisedButton label="Edit" fullWidth={true} onTouchTap={this._handleEditEventGuest.bind(this)} />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditEventGuest);

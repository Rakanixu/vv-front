import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ColorPicker from 'material-ui-color-picker';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './NewPrincipal.css';

const config = require('../../config.json');
const moment = require('moment');
var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  },
  screenHeight: {
    height: window.innerHeight - 150
  }
};

class NewPrincipal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      background: {},
      logo: {}
    };
  }

  _handleTextFieldChange(e) {
    var state = {}
    state[e.target.dataset.val] = e.target.value;
    this.setState(state);
    this.setState({ error: null });
  }

  _handelPrimaryColorChange(color) {
    this.state.primary_color = color;
  }

  _handelSecondaryColorChange(color) {
    this.state.secondary_color = color;
  }

  _onBackgroundChange = (pictures) => {
    this.setState({ background: pictures });
  }

  _onLogoChange = (pictures) => {
    this.setState({ logo: pictures });
  }

  _handleNewPrincipal(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.name === undefined || this.state.name === "") {
      this._handleError();
      return;
    }

    this._createPrincipal()
    .then(function(res) {
      this.props.history.push('/root/principal');
    }.bind(this))
    .catch(err => {
      this._handleError(err);
    });
  }

  _createPrincipal() {
    var background, logo;
    for (var i in this.state.background) {
      background = this.state.background[i];
      break;
    }

    for (var i in this.state.logo) {
      logo = this.state.logo[i];
      break;
    }

    try {
      background = dataURItoBlob(background);
      logo = dataURItoBlob(logo);
    } catch (err) {}

    var data = new FormData();
    data.append('name', this.state.name);
    data.append('domain', this.state.domain);
    data.append('design', this.state.design);
    data.append('primary_color', this.state.primary_color);
    data.append('secondary_color', this.state.secondary_color);
    data.append('tags', this.state.tags);
    data.append('description', this.state.description);
    data.append('created_at', moment().utc(new Date()).format());
    data.append('enabled', true);
    data.append('background', background, 'background');
    data.append('logo', logo, 'logo');

    return axios.post(config.baseAPI_URL + '/principal', data);
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
          <ErrorReporting open={this.state.error !== null}
                    error={this.state.error} />
          <form className="newPrincipalForm">
            <TextField floatingLabelText="Name"
                      data-val="name"
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Domain"
                      data-val="domain"
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Design"
                      data-val="design"
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <ColorPicker floatingLabelText="Primary color"
                      defaultValue='#000'
                      onChange={this._handelPrimaryColorChange.bind(this)} />
            <ColorPicker floatingLabelText="Secondary color"
                      defaultValue='#000'
                      onChange={this._handelSecondaryColorChange.bind(this)} />
            <TextField floatingLabelText="Description"
                      data-val="description"
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Tags"
                      data-val="tags"
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <div className="fit">
              <UploadPreview title="Background" label="Add" data-item="backgrou" onChange={this._onBackgroundChange} style={styles.fit}/>
            </div>
            <div className="fit">
              <UploadPreview title="Logo" label="Add" onChange={this._onLogoChange} style={styles.fit}/>
            </div>

            <RaisedButton label="Save principal" 
                          className="right margin-bottom-medium" 
                          primary={true} 
                          onTouchTap={this._handleNewPrincipal.bind(this)} />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(NewPrincipal);

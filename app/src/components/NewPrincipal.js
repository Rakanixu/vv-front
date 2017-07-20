import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Upload from 'material-ui-upload/Upload';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import Nav from './Nav';
import axios from 'axios';
import './NewPrincipal.css';

const config = require('./../config.json');
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
    data.append('background', background);
    data.append('logo', logo);

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
      <div className="container" style={styles.screenHeight}>
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
            <TextField floatingLabelText="Primary Color"
                      data-val="primary_color"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Secondary Color"
                      data-val="secondary_color"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
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

            <RaisedButton label="Save principal" fullWidth={true} onTouchTap={this._handleNewPrincipal.bind(this)} />
          </form>
        </div>  
      </div>
    );
  }
}

function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var array = [];
  for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }

  return new Blob([new Uint8Array(array)], {type: mimeString, extension: '.png'});
}

export default withRouter(NewPrincipal);

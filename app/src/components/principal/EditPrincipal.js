import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ColorPicker from 'material-ui-color-picker';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EditPrincipal.css';

const config = require('../../config.json');
var styles = {
  fit: {
    overflow: 'hidden',
    maxHeight: 400
  },
  screenHeight: {
    height: window.innerHeight - 150
  }
};

class EditPrincipal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      colorPickerUpdater1: 'initialcolorPickerUpdater1',
      colorPickerUpdater2: 'initialcolorPickerUpdater2',
      background: {},
      logo: {},
      showBackground: true,
      showLogo: true,
      url: config.baseAPI_URL + '/principal',
      principal: {}
    };
  }

  componentWillMount() {
    this._getPricipal();
  }

  _getPricipal() {
    axios.get(this.state.url + '/' + this.props.match.params.principalId).then(res => {
      this.setState({
        principal: res.data,
        colorPickerUpdater1: new Date().getTime() + 'A',
        colorPickerUpdater2: new Date().getTime() + 'B',
      });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _handleEditPrincipal() {
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

    if (!background) {
      background = this.state.principal.background;
    }

    if (!logo) {
      logo = this.state.principal.logo;
    }

    var data = new FormData();
    data.append('name', this.state.principal.name);
    data.append('domain', this.state.principal.domain);
    data.append('design', this.state.principal.design);
    data.append('primary_color', this.state.principal.primary_color);
    data.append('secondary_color', this.state.principal.secondary_color);
    data.append('tags', this.state.principal.tags);
    data.append('description', this.state.principal.description);
    data.append('created_at', this.state.principal.created_at);
    data.append('background', background);
    data.append('logo', logo);

    axios.put(config.baseAPI_URL + '/principal/' + this.props.match.params.principalId, data).then(function(res) {
      this.props.history.push('/root/principal');
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _onBackgroundChange = (pictures) => {
    this.setState({
      background: pictures,
      showBackground: false
    });
  }

  _onLogoChange = (pictures) => {
    this.setState({
      logo: pictures,
      showLogo: false
    });
  }

  _handleTextFieldChange(e) {
    this.state.principal[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _handelPrimaryColorChange(color) {
    this.state.principal.primary_color = color;
  }

  _handelSecondaryColorChange(color) {
    this.state.principal.secondary_color = color;
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
                      value={this.state.principal.name}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Domain"
                      data-val="domain"
                      value={this.state.principal.domain}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Design"
                      data-val="design"
                      value={this.state.principal.design}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <ColorPicker key={this.state.colorPickerUpdater1}
                      ref="colorPickerPrimary"
                      floatingLabelText="Primary color"
                      defaultValue={this.state.principal.primary_color}
                      onChange={this._handelPrimaryColorChange.bind(this)} />
            <ColorPicker key={this.state.colorPickerUpdater2}
                      ref="colorPickerSecondary"
                      floatingLabelText="Secondary color"
                      defaultValue={this.state.principal.secondary_color}
                      onChange={this._handelSecondaryColorChange.bind(this)} />
            <TextField floatingLabelText="Description"
                      data-val="description"
                      value={this.state.principal.description}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            <TextField floatingLabelText="Tags"
                      data-val="tags"
                      value={this.state.principal.tags}
                      onChange={this._handleTextFieldChange.bind(this)}
                      fullWidth={true} />
            { this.state.showBackground ? <img className="preview-img" src={config.baseURL + this.state.principal.background} alt="preview background"/> : null }
            <div className="fit">
              <UploadPreview title="Background" label="Add" onChange={this._onBackgroundChange} style={styles.fit}/>
            </div>
            { this.state.showLogo ? <img className="preview-img" src={config.baseURL + this.state.principal.logo} alt="preview logo"/> : null }
            <div className="fit">
              <UploadPreview title="Logo" label="Add" onChange={this._onLogoChange} style={styles.fit}/>
            </div>

            <RaisedButton label="Save principal" fullWidth={true} onTouchTap={this._handleEditPrincipal.bind(this)} />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditPrincipal);

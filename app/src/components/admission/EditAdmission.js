import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from '../../utils';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import IconSelection from '../image/IconSelection';
import axios from 'axios';
import './EditAdmission.css';

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

class EditAdmission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      icon: {},
      url: config.baseAPI_URL + '/event/' + this.props.match.params.eventId + '/admission/' + this.props.match.params.admissionId,
      admission: {}
    };
  }

  componentDidMount() {
    this._getAdmission();
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getAdmission() {
    axios.get(this.state.url).then(function(res) {
      this.setState({
        admission: res.data
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

  _iconChange(img) {
    this.state.admission.icon = img;
    this.setState({ admission: this.state.admission });
  }

  _handleEditAdmission(e) {
    this._editAdmission()
    .then(function(res) {
      this.props.history.push({
        pathname: '/manager/' + this._getType() + '/edit/' + this.props.match.params.eventId + '/detail',
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
    if (this.state.admission.title === undefined || this.state.admission.title === '' ||
      this.state.admission.price === undefined || this.state.admission.price === '') {
      return new Promise(function(resolve, reject) { reject(); });
    }

    var data = new FormData();
    data.append('title', this.state.admission.title);
    data.append('subtitle', this.state.admission.subtitle || '');
    data.append('price', this.state.admission.price);
    data.append('description', this.state.admission.description || '');
    data.append('icon', this.state.admission.icon);

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
              <TextField floatingLabelText="Price ($ USD)"
                        data-val="price"
                        value={parseFloat(this.state.admission.price || 0).toFixed(2)}
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
              <IconSelection onChange={this._iconChange.bind(this)} 
                             defaultIcon={this.state.admission.icon}
                             hideDefaultImageButton={true}/>
            </Paper>       
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditAdmission);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dataURItoBlob } from './../utils';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPreview from 'material-ui-upload/UploadPreview';
import ErrorReporting from 'material-ui-error-reporting';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from 'axios';
import './EditUser.css';

axios.defaults.withCredentials = true; 

const moment = require('moment');
const config = require('./../config.json');
const styles = {
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
var user = {};

class EditUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      avatar: {},
      avatarUrl: '',
      user: {},
      url: config.baseAPI_URL + '/user/' + this.props.match.params.userId
    };
  }

  componentWillMount() {
    if (localStorage.getItem('alantu-user')) {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
    this._getUser();
  }

  _getUser() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ 
        user: res.data,
        avatarUrl: res.data.avatar
      });
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleTextFieldChange(e) {
    this.state.user[e.target.dataset.val] = e.target.value;
    this.setState({ error: null });
  }

  _onAvatarChange = (pictures) => {
    this.setState({ 
      avatar: pictures,
      avatarUrl: ''
    });
  }

  _handleRoleChange = (e, index, val) => {
    this.state.user.role_id = val;
    this.setState({ user: this.state.user });
  }

  _handleEditUser(e) {
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);

    if (this.state.user.password !== this.state.user.password_confirmation ||
      this.state.user.password === undefined || this.state.user.password === '' ||
      this.state.user.password_confirmation === undefined || this.state.user.password_confirmation === '' ||
      this.state.user.email === undefined || this.state.user.email === '') {
      this._handleError();
      return;
    }

    this._editUser()
    .then(function(res) {
      this.props.history.push('/manager/users');
    }.bind(this))
    .catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _editUser() {
    var avatar;
    for (var i in this.state.avatar) {
      avatar = this.state.avatar[i];
      break;
    }

    try {
      avatar = dataURItoBlob(avatar);
    } catch (err) {}

    if (!avatar) {
      avatar = this.state.avatarUrl;
    }

    var now = moment(new Date()).utc().format();
    var data = new FormData();
    data.append('principal_id', user.principal_id);
    data.append('role_id', this.state.user.role_id);
    data.append('username', this.state.user.username);
    data.append('email', this.state.user.email);
    data.append('password', this.state.user.password);
    data.append('created_at', this.state.user.created_at);
    data.append('updated_at', now);
    data.append('avatar', avatar);

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

          <form className="EditUser">
            <TextField floatingLabelText="Username" 
                      data-val="username"
                      value={this.state.user.username}
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Email"
                      data-val="email"
                      value={this.state.user.email}
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />
            <TextField floatingLabelText="Password"
                      data-val="password"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />                  
            <TextField floatingLabelText="Password confirmation"
                      data-val="password_confirmation"
                      onChange={this._handleTextFieldChange.bind(this)} 
                      fullWidth={true} />  

            <SelectField floatingLabelText="Select role"
                        fullWidth={true}
                        value={this.state.user.role_id}
                        onChange={this._handleRoleChange}>
            {Object.keys(config.roles).map((role, i) => (
              <MenuItem key={i+1} value={i+1} primaryText={role} />
            ))}
          </SelectField>
            { this.state.avatarUrl !== undefined && this.state.avatarUrl.length > 0 ?
              <img className="img-preview" src={config.baseURL + this.state.avatarUrl} alt="user avatar" />
              : null }
            <div className="fit">
              <UploadPreview title="User avatar" label="Add" onChange={this._onAvatarChange} style={styles.fit}/>  
            </div>

            <RaisedButton label="Edit" fullWidth={true} onTouchTap={this._handleEditUser.bind(this)} />
          </form>
        </div>  
      </div>
    );
  }
}

export default withRouter(EditUser);

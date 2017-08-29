import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import RaisedButton from 'material-ui/RaisedButton';
import Delete from 'material-ui/svg-icons/action/delete';
import ErrorReporting from 'material-ui-error-reporting';
import ImgSelectionWrapper from '../image/ImgSelectionWrapper';
import Paper from 'material-ui/Paper';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import FlagsSelect from 'react-flags-select';
import axios from 'axios';
import '../../../node_modules/react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import 'react-flags-select/css/react-flags-select.css';
import './Profile.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const styles = {
  paperLeft: {
    padding: 20,
    overflow: 'auto',
    width: '25%',
    float: 'left',
    minWidth: 220,
    marginRight: 40,
    height: 'min-content'
  },
  paperRight: {
    padding: 20,
    overflow: 'auto',
    width: '74%',
    float: 'left',
    minWidth: 150,
    height: 'min-content'
  }
};

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      userUrl: config.baseAPI_URL + '/user/',
      user: {},
      avatar: '',
      timezone: '',
      language: '',
      id: 0
    };
  }

  componentWillMount() {
    let user = JSON.parse(localStorage.getItem('alantu-user'));
    if (user && user.id) {
      this.state.id = user.id;
      this._getProfile(user.id);
    } else {
      this.props.history.push('/login');
    }
  }

  _getProfile(id) {
    axios.get(this.state.userUrl + id).then(function(res) {
      console.log(res.data);
      this.setState({ 
        user: res.data,
        avatar: res.data.avatar,
        timezone: res.data.timezone,
        language: res.data.language
      });

      if (this.refs.imgSelectorWrapper) {
        this.refs.imgSelectorWrapper.setState({ defaultValue: this.state.avatar });
      }
      if (this.refs.flagSelect) {
        this.refs.flagSelect.setState({ defaultCountry : this.state.language });
      }
      if (this.refs.timezonePicker) {
        this.refs.timezonePicker.setState({ value : this.state.timezone });
      }
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _getRoleNameById = (id) => {
    for (var i in config.roles) {
      if (config.roles[i].id === id) {
        return config.roles[i].name;
      }
    }
    return '';
  }

  _profileImageChange(img) {
    this.state.user.avatar = img;
    this.setState({ user: this.state.user });
  }

  _handleLanguageChange(val) {
    this.state.user.language = val;
    this.setState({ user: this.state.user });
  }

  _handleTimezoneChange(val) {
    this.state.user.timezone = val;
    this.setState({ user: this.state.user });
  }

  _handleSave() {
    var data = new URLSearchParams();
    data.append('avatar', this.state.user.avatar);
    data.append('timezone', this.state.user.timezone);
    data.append('language', this.state.user.language);

    axios.put(this.state.userUrl + this.state.id, data).then(function(res) {
      this._getProfile(res.data.id);
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _handleError(err) {
    this.setState({ error: err });
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);
  }

  render() {
    return (
      <div className="container">
        <ErrorReporting open={this.state.error !== null}
                        error={this.state.error} />

        <div>
          <div className="title">
            <h1>Edit your Profile</h1>
            <div className="actions-container">
              <RaisedButton label="Save"
                            primary={true}
                            onTouchTap={this._handleSave.bind(this)} />
            </div>
          </div>  

          <div className="profile"> 
            <Paper style={styles.paperLeft} className="profile-picture">
              <ImgSelectionWrapper  ref="imgSelectorWrapper"
                                    onChange={this._profileImageChange.bind(this)} 
                                    className="profile-picture"
                                    defaultImage={this.state.avatar}
                                    hideDefaultImageButton={true}/>
            </Paper>

            <Paper style={styles.paperRight} className="profile-data">
              <h2>{this._getRoleNameById(this.state.user.role_id)}</h2>
              <label>Default language</label>
              <FlagsSelect ref="flagSelect"
                           countries={['US', 'GB']} 
                           customLabels={{'US': 'EN-US','GB': 'EN-GB'}}
                           defaultCountry={this.state.language}
                           onSelect={this._handleLanguageChange.bind(this)}/>

              <label>Default timezone</label>
              <TimezonePicker ref="timezonePicker"
                              absolute={false} 
                              value={this.state.timezone} 
                              placeholder= "Select timezone..."
                              onChange={this._handleTimezoneChange.bind(this)}/>
            </Paper>
          </div>
        </div>  
      </div>
    )
  }
}

export default withRouter(Profile);
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList';
import {Tabs, Tab} from 'material-ui/Tabs';
import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionClear from 'material-ui/svg-icons/content/clear';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Search from 'material-ui/svg-icons/action/search';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import Create from 'material-ui/svg-icons/file/create-new-folder';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import ConfirmationDialog from '../confirmation-dialog/ConfirmationDialog';
import { ToastContainer, ToastMessage } from 'react-toastr';
import axios from 'axios';
import './EventsGridList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const moment = require('moment');
const _ = require('lodash/core');
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
const styles = {
  root: {
    padding: 50,
    paddingTop: 20
  },
  gridList: {
    maxWidth: 1800,
    overflowY: 'auto',
    paddingTop: 10,
    cols: 4
  },
  startButton: {
    position: 'relative',
    marginRight: 10
  },
  startLabel: {
    color: '#fff',
    textTransform: 'none'
  },
  stopButton: {
    position: 'relative',
    marginLeft: 10
  },
  stopLabel: {
    color: '#fff',
    textTransform: 'none'
  },
  copyButton: {
    height: 30,
    width: 65,
    minWidth: 20,
    marginRight: 5
  },
  copyLabel: {
    margin: 5,
    fontSize: 12,
    color: '#fff',
    padding: 0
  },
  copyIcon: {
    width: 15,
    height: 15,
    marginLeft: 0
  },
  editButton: {
    height: 30,
    width: 60,
    minWidth: 20,
    marginLeft: 5
  },
  editLabel: {
    margin: 5,
    fontSize: 12,
    color: '#fff',
    padding: 0
  },
  editIcon: {
    width: 15,
    height: 15,
    marginLeft: 0
  },
  deleteButton: {
    height: 30,
    width: 72,
    minWidth: 20,
    marginLeft: 5
  },
  deleteLabel: {
    margin: 5,
    fontSize: 12,
    color: '#fff',
    padding: 0
  },
  deleteIcon: {
    width: 15,
    height: 15,
    marginLeft: 0
  }
};
let user = {};

class EventsGridList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      domain: '',
      showDeleteConfirmation: false,
      principalUrl:  config.baseAPI_URL + '/principal/',
      events: []
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.isTemplate !== this.props.isTemplate) {
      this._hideConfirmation();

      setTimeout(function() {
        this._getEvents();
      }.bind(this), 50);
    }
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      if (!this.props.authenticated === false) {
        this._handleError(new Error('User cannot be retrieved'));
      }
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }

    this._getPrincipal(user.principal_id).then(function(res) {
      this.setState({ domain: res.data.domain });
    }.bind(this));

    this._getEvents();
  }

  _url() {
    return config.baseAPI_URL + '/' + this._getType();
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getPrincipal = (id) => {
    let url;
    if (!id) {
      url = this.state.principalUrl + 'me';
    } else {
      url = this.state.principalUrl + id;
    }
    return axios.get(url);
  }

  _getEvents() {
    axios.get(this._url()).then(function(res) {
      this.setState({ events: res.data });
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _deleteEvent() {
    axios.delete(this._url() + '/' + this.state.eventId).then(function (res) {
      this._getEvents();
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
    this._hideConfirmation();
  }

  _handlePageChange() {
    this.props.history.push('/manager/' + this._getType() + '/new');
  }

  _handleEdit(e) {
    this.props.history.push('/manager/' + this._getType() + '/edit/' + e.currentTarget.dataset.id);
  }

  _handleDelete(e) {
    this.setState({
      showDeleteConfirmation: true,
      eventId: e.currentTarget.dataset.id
    });
  }

  _hideConfirmation() {
    this.setState({ showDeleteConfirmation: false });
  }

  _handleCopy(e) {
    axios.post(config.baseAPI_URL + '/' + this._getType() + '/' + e.currentTarget.dataset.id + '/copy', {}).then(function(res) {
      this.props.history.push('/manager/event/edit/' + res.data.id);
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _handleStartEvent(e) {
    this._startEvent(e.currentTarget.dataset.id).then(function(res) {
      this.refs.toastContainer.success('Event ' + res.data.title + ' started.', '', { closeButton: true });
      window.open(
        'https://' + this.state.domain + '/event/' + res.data.id + '/run?t=' + localStorage.getItem('token'), 
        '_blank'
      );
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleStopEvent(e) {
    this._stopEvent(e.currentTarget.dataset.id).then(function(res) {
      this.refs.toastContainer.success('Event ' + res.data.title + ' stopped.', '', { closeButton: true });
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _startEvent(id) {
    return axios.post(config.baseAPI_URL + '/event/' + id + '/start', {});
  }

  _stopEvent(id) {
    return axios.post(config.baseAPI_URL + '/event/' + id + '/stop', {});
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
      <div style={styles.root}>
        <ToastContainer ref="toastContainer"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right" />

        <ConfirmationDialog title="Confirm deletion"
                            message="Are you sure to do this? Can't be undone."
                            confirmLabel="Confirm"
                            cancelLabel="Cancel"
                            showDialog={this.state.showDeleteConfirmation}
                            onConfirm={this._deleteEvent.bind(this)}
                            onCancel={this._hideConfirmation.bind(this)}/>

        <ErrorReporting open={this.state.error !== null}
                        error={this.state.error} />

        {(this.props.authenticated !== false) ? 
        <div className="events-title">
          <h1>Overview {this._getType().capitalize()}s</h1>
          <div className="events-new-event">
            <RaisedButton label={'New ' + this._getType().capitalize()}
                          primary={true}
                          onTouchTap={this._handlePageChange.bind(this)}/>
          </div>
        </div>
        : null }

        <GridList ref="grid"
                  className="events-cards-grid"
                  cellHeight={320}
                  cols={styles.gridList.cols}
                  style={styles.gridList}
                  padding={20}>
          {this.state.events.map((event) => (
            <GridTile key={event.id}
                      className="events-card-block">

              <div className="events-card-block__content">
                <div className="events-card-block-img">
                  <div className="events-card-block-img-wrapper">
                    <div className="events-card-block-img-wrapper-inner">
                      <div className="events-card-block-img-wrapper-inner__img"
                           style={{backgroundImage: `url(${config.baseURL + event.preview_img})`}}>
                      </div>
                    </div>
                    <div className="events-card-block-title">{event.title}</div>

                    {(this.props.authenticated !== false) ? 
                    <div className="events-card-block__content__buttons__sub">
                      {!this.props.isTemplate ?
                      <RaisedButton className="events-copy-btn"
                                    label="Copy"
                                    labelStyle={styles.copyLabel}
                                    icon={<ContentCopy color="white" style={styles.copyIcon}/>}
                                    data-id={event.id}
                                    style={styles.copyButton}
                                    onTouchTap={this._handleCopy.bind(this)}/>
                      :
                      <RaisedButton className="events-copy-btn"
                                    label="New"
                                    labelStyle={styles.copyLabel}
                                    icon={<Create color="white" style={styles.copyIcon}/>}
                                    data-id={event.id}
                                    style={styles.copyButton}
                                    onTouchTap={this._handleCopy.bind(this)}/>
                      }

                      <RaisedButton className="events-edit-btn"
                                    label="Edit"
                                    labelStyle={styles.editLabel}
                                    icon={<ModeEdit color="white" style={styles.editIcon}/>}
                                    data-id={event.id}
                                    style={styles.editButton}
                                    onTouchTap={this._handleEdit.bind(this)}/>
                      <RaisedButton className="events-delete-btn"
                                    label="Delete"
                                    labelStyle={styles.deleteLabel}
                                    icon={<Delete color="white" style={styles.deleteIcon}/>}
                                    data-id={event.id}
                                    style={styles.deleteButton}
                                    onTouchTap={this._handleDelete.bind(this)}/>
                    </div>
                    : null}
                  </div>
                </div>
                <div className="events-card-block__content__buttons">
                  {!this.props.isTemplate && (this.props.authenticated !== false) ?
                  <div className="events-card-block__content__buttons__main">
                    <RaisedButton className="events-start-btn"
                                  label="Start"
                                  labelStyle={styles.startLabel}
                                  data-id={event.id}
                                  onTouchTap={this._handleStartEvent.bind(this)}
                                  style={styles.startButton}/>
                    <RaisedButton className="events-stop-btn"
                                  data-id={event.id}
                                  labelStyle={styles.stopLabel}
                                  label="Stop"
                                  onTouchTap={this._handleStopEvent.bind(this)}
                                  style={styles.stopButton}/>
                  </div>
                  : null }
                </div>
              </div>
            </GridTile>
          ))}
        </GridList>
      </div>
    )
  }
}

export default withRouter(EventsGridList);

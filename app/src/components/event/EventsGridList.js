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
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './EventsGridList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const moment = require('moment');
const _ = require('lodash/core');
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
    width: 70,
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
    width: 70,
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
  tabs: {
    height: 200,
    backgroundColor: '#ffffff'
  },
  tab: {

    color: 'gray',
    marginTop: -5,
    height: 45,
    textTransform: 'none'
  },
  inkBarStyle: {
    background: '#ffffff',
    height: 40,
    marginTop: -40
  },
  tabItemContainerStyle: {
    background: 'rgb(219, 223, 222)'
  },
  tabTemplateStyle: {
    background: '#ffffff'
  },
  searchRow: {
    display: 'flex',
    width: '95%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
    overflow: 'hidden',
    height: 40
  },
  searchItemsRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '95%',
    marginTop: 20,
    overflow: 'hidden',
    height: 40
  },
  searchRowLeftSide: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  searchRowRightSide: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  addSearchItem: {
    fontSize: 15,
    textTransform: 'none'
  }
};

class EventsGridList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      url: config.baseAPI_URL + '/event',
      events: []
    };
  }

  componentDidMount() {
    this._getEvents();
  }

  _getEvents() {
    axios.get(this.state.url).then(function(res) {
      this.setState({ events: res.data });
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _handlePageChange() {
    this.props.history.push('/manager/event/new');
  }

  _handleEdit(e) {
    this.props.history.push('/manager/event/edit/' + e.currentTarget.dataset.id);
  }

  _handleDelete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.dataset.id).then(function (res) {
      this._getEvents();
    }.bind(this)).catch(err => {
      this._handleError(err);
    });
  }

  _handleCopy(e) {
    let event = {};
    for (var i = 0; i < this.state.events.length; i++) {
      if (this.state.events[i].id.toString() === e.currentTarget.dataset.id) {
        event = _.clone(this.state.events[i]);
        delete event.id;
        break;
      }
    }

    var data = new FormData();
    for (var i in event) {
      data.append(i, event[i]);
    }

    axios.post(config.baseAPI_URL + '/event', data).then(function(res) {
      this.props.history.push('/manager/event/edit/' + res.data.id);
    }.bind(this)).catch(err => {
      this._handleError(err);
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
      <div style={styles.root}>
        <ErrorReporting open={this.state.error !== null}
          error={this.state.error} />

        <div className="events-title">
          <h1>Overview Events</h1>
          <div className="events-new-event">
            <RaisedButton label="New Event"
                          primary={true}
                          onTouchTap={this._handlePageChange.bind(this)}
            />
          </div>
        </div>
        <Tabs
            style={styles.tabs}
            tabItemContainerStyle={styles.tabItemContainerStyle}
            tabTemplateStyle={styles.tabTemplateStyle}
            inkBarStyle={styles.inkBarStyle}>
          <Tab
              style={styles.tab}
              label="All Events" >
            <div>
              <p>
                This is an example tab.
              </p>
              <p>
                You can put any sort of HTML or react component in here. It even keeps the component state!
              </p>
            </div>
          </Tab>
          <Tab
              style={styles.tab}
              label="Custom" >
            <div>
              <p className="events-tabs__custom">
                  <Paper
                      zDepth={1}
                      style={styles.searchRow}>
                    <div style={styles.searchRowLeftSide}>
                      <DropDownMenu
                          value={1}
                          underlineStyle={{display: 'none'}}
                          iconStyle={{marginRight: -20}}
                          style={{height: 60, borderRight: 'solid 1px rgb(219, 223, 222)'}}
                          onChange={this.handleChange}>
                        <MenuItem value={1} primaryText="Filter products" />
                        <MenuItem value={2} primaryText="Item one" />
                        <MenuItem value={3} primaryText="Item two" />
                        <MenuItem value={4} primaryText="Item three" />
                        <MenuItem value={5} primaryText="Item +" />
                      </DropDownMenu>
                      <IconButton>
                        <Search color={'black'} />
                      </IconButton>
                      <TextField
                          underlineShow={false}
                          hintText="Start typing to search for products..."
                      />
                    </div>
                    <div style={styles.searchRowRightSide}>
                      <FlatButton
                          style={{height: 40, borderLeft: 'solid 1px rgb(219, 223, 222)'}}
                          labelStyle={styles.addSearchItem}
                          label="Save this search" />
                      <FlatButton
                          style={{height: 45}}
                          icon={<ActionDelete color={'#ffffff'} />}
                          backgroundColor={'rgb(72, 78, 100)'}/>
                    </div>
                  </Paper>
                <div style={styles.searchItemsRow}>
                  <FlatButton
                      label="Product vendor is Alantu"
                      labelPosition="before"
                      backgroundColor={'rgb(54, 152, 222)'}
                      style={{borderRadius: 15}}
                      labelStyle={{fontSize: 12, color: '#ffffff', textTransform: 'none'}}
                      primary={true}
                      icon={<ActionClear color={"#ffffff"} />}
                  />
                </div>
              </p>
            </div>
          </Tab>
          <Tab
              style={styles.tab}
              label="Period" >
            <div>
              <h2 style={styles.headline}>Tab Two</h2>
              <p>
                This is another example tab.
              </p>
            </div>
          </Tab>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
          <Tab
              style={styles.tab}
              disabled/>
        </Tabs>

        <GridList ref="grid"
                  className="events-cards-grid"
                  cellHeight={320}
                  cols={styles.gridList.cols}
                  style={styles.gridList}
                  padding={20}>
          {this.state.events.map((event) => (
            <GridTile key={event.id}
                      className="events-card-block"
                      >
                      {/*
                      title={event.title}
                      subtitle={event.subtitle}
                      subtitle={moment(event.date).format("MMM Do YYYY")}
                      */}

              <div className="events-card-block__content">
                <div className="events-card-block-img">
                  <div className="events-card-block-img-wrapper">
                    <div className="events-card-block-img-wrapper-inner">
                      <div className="events-card-block-img-wrapper-inner__img"
                           style={{backgroundImage: `url(${config.baseURL + event.preview_img})`}}>
                      </div>
                    </div>
                    <div className="events-card-block-title">{event.title}</div>

                    <div className="events-card-block__content__buttons__sub">
                      <RaisedButton className="events-copy-btn"
                                    label="Copy"
                                    labelStyle={styles.copyLabel}
                                    icon={<ContentCopy color="white" style={styles.copyIcon}/>}
                                    data-id={event.id}
                                    style={styles.copyButton}
                                    onTouchTap={this._handleCopy.bind(this)}
                      />
                      <RaisedButton className="events-edit-btn"
                                    label="Edit"
                                    labelStyle={styles.editLabel}
                                    icon={<ModeEdit color="white" style={styles.editIcon}/>}
                                    data-id={event.id}
                                    style={styles.editButton}
                                    onTouchTap={this._handleEdit.bind(this)}
                      />
                    </div>
                  </div>
                </div>
                <div className="events-card-block__content__buttons">
                  <div className="events-card-block__content__buttons__main">
                    <RaisedButton className="events-start-btn"
                                  label="Start"
                                  labelStyle={styles.startLabel}
                                  data-id={event.id}
                                  style={styles.startButton}
                    />
                    <RaisedButton className="events-stop-btn"
                                  data-id={event.id}
                                  labelStyle={styles.stopLabel}
                                  label="Stop"
                                  style={styles.stopButton}
                    />
                  </div>
                  <div className="events-card-block__content__buttons__reset">
                    <a href="#">Reset</a>
                  </div>
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

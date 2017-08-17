import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './EventLocationList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var styles = {
  screenHeight: {
    height: window.innerHeight - 110
  },
  alignLeft: {
    textAlign: 'left'
  },
  narrow: {
    width: 40,
    cursor: 'pointer'
  },
  narrowCenter: {
    width: 30,
    marginLeft: 10,
    cursor: 'pointer'
  },
  paperFab: {
    position: 'absolute',
    bottom: 80,
    right: 40
  }
};

class EventLocationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight,
      error: null,
      url: config.baseAPI_URL + '/event_location',
      event_locations: []
    };
  }

  componentWillMount() {
    this._getEventLocations();
  }

  _getEventLocations() {
    axios.get(this.state.url).then(res => {
      this.setState({ event_locations: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _handlePageChange() {
    this.props.history.push('/manager/event_location/new');
  }

  _edit(e) {
    this.props.history.push('/manager/event_location/edit/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getEventLocations();
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleError(err) {
    this.setState({ error: err });
    setTimeout(function() {
      this.setState({ error: null });
    }.bind(this), 5000);
  }

  render() {
    return (
      <div className="container-list">
        <ErrorReporting open={this.state.error !== null}
          error={this.state.error} />

        <div className="title">
          <h1>Event Locations</h1>
          <div className="new-event-location">
            <RaisedButton label="New Event Location" primary={true} onTouchTap={this._handlePageChange.bind(this)} />
          </div>
        </div>  

        <Table fixedHeader={true} height={'"' + this.state.tableHeight.toString() + '"'}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.alignLeft}>Title</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Remark</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Street</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>City</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>ZIP</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Date</TableHeaderColumn>
              <TableHeaderColumn style={styles.narrow}>Edit</TableHeaderColumn>
              <TableHeaderColumn style={styles.narrow}>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.event_locations.map((event_location, i) =>
              <TableRow key={i} data-id={event_location.id}>
                <TableRowColumn style={styles.alignLeft}>{event_location.title}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{event_location.remark}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{event_location.street}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{event_location.city}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{event_location.zip}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{new Date(event_location.opening_hours).toJSON().slice(0,10).replace(/-/g,'/')}</TableRowColumn>
                <TableRowColumn style={styles.narrowCenter} onTouchTap={this._edit.bind(this)}><ModeEdit/></TableRowColumn>
                <TableRowColumn style={styles.narrowCenter} onTouchTap={this._delete.bind(this)}><Delete/></TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withRouter(EventLocationList);

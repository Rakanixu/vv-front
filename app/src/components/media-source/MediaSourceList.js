import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './MediaSourceList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var styles = {
  alignLeft: {
    textAlign: 'left'
  },
  tablePreview: {
    width: 100,
    maxWidth: 100,    
    margin: 0,
    padding: 0
  },
  narrow: {
    width: 40,
    cursor: 'pointer'
  },
  narrowCenter: {
    width: 30,
    marginLeft: 10,
    cursor: 'pointer'
  }
};

class MediaSourceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight - 125,
      error: null,
      url: config.baseAPI_URL + '/event/' + this.props.eventId + '/named_guest',
      event_guests: []
    };
  }

  componentWillMount() {
    this._getEventGuests();
  }

  _getEventGuests() {
    axios.get(this.state.url).then(res => {
      this.setState({ event_guests: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _edit(e) {
    this.props.history.push('/manager/event/edit/' + this.props.eventId + '/event_guest/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getEventGuests();
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
      <div>
        <ErrorReporting open={this.state.error !== null}
          error={this.state.error} />

        <Table fixedHeader={true}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={{width: '52px'}}>Media</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Description</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Media type</TableHeaderColumn>
              { !this.props.noEdit ?
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
              : null }
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.event_guests.map((event_guest, i) =>
              <TableRow key={i} data-id={event_guest.id}>
                <TableRowColumn style={styles.tablePreview}>
                  <img className="table-img" src={config.baseURL + event_guest.main_media} alt="named guest media file"/>
                </TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{event_guest.name}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{event_guest.description}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{config.name_guest_media_type[event_guest.main_media_type_id - 1].name}</TableRowColumn>
                { !this.props.noEdit ?
                <TableRowColumn style={styles.narrowCenter} onTouchTap={this._edit.bind(this)}><ModeEdit/></TableRowColumn>
                : null }
                <TableRowColumn style={styles.narrowCenter} onTouchTap={this._delete.bind(this)}><Delete/></TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withRouter(MediaSourceList);

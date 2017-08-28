import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './PollEntryList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const styles = {
  alignLeft: {
    textAlign: 'left'
  },
  image: {
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

class PollEntryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollId: this.props.match.params.pollId,
      tableHeight: window.innerHeight - 125,
      error: null,
      url: config.baseAPI_URL + '/poll/',
      poll_entries: []
    };
  }

  componentWillMount() {
    this._getPollEntries(this.props.match.params.pollId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pollId && nextProps.pollId >= 0) {
      this.setState({ pollId: nextProps.pollId });
      this._getPollEntries(nextProps.pollId);
    }
  }

  _getPollEntries(pollId) {
    axios.get(this.state.url + pollId + '/poll_entry').then(res => {
      this.setState({ poll_entries: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _edit(e) {
    this.props.history.push('/manager/event/edit/' + this.props.eventId + '/poll/' + this.state.pollId + '/poll_entry/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + this.state.pollId + '/poll_entry/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getPollEntries(this.state.pollId);
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

        <Table fixedHeader={true} height={'"' + this.state.tableHeight.toString() + '"'}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.alignLeft}>Title</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Description</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Icon</TableHeaderColumn>
              { !this.props.noEdit ?
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
              : null }
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.poll_entries.map((poll_entry, i) =>
              <TableRow key={i} data-id={poll_entry.id}>
                <TableRowColumn style={styles.alignLeft}>{poll_entry.title}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{poll_entry.description}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{poll_entry.icon}</TableRowColumn>
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

export default withRouter(PollEntryList);

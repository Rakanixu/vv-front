import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './PollsList.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
var styles = {
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

class PollsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight - 125,
      error: null,
      url: config.baseAPI_URL + '/event/' + this.props.eventId + '/poll',
      polls: []
    };
  }

  componentWillMount() {
    this._getPolls();
  }

  _getType() {
    return (this.props.isTemplate ? 'template' : 'event');
  }

  _getPolls() {
    axios.get(this.state.url).then(res => {
      this.setState({ polls: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _edit(e) {
    this.props.history.push('/manager/' + this._getType() + '/edit/' + this.props.eventId + '/poll/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getPolls();
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
              <TableHeaderColumn style={styles.alignLeft}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Description</TableHeaderColumn>
              { !this.props.noEdit ?
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
              : null }
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.polls.map((poll, i) =>
              <TableRow key={i} data-id={poll.id}>
                <TableRowColumn style={styles.alignLeft}>{poll.name}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{poll.description}</TableRowColumn>
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

export default withRouter(PollsList);

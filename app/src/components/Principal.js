import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import Nav from './Nav';
import './Principal.css';

axios.defaults.withCredentials = true;

const config = require('./../config.json');
var styles = {
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
  }
};

class Principal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight - 125,
      error: null,
      url: config.baseAPI_URL + '/principal',
      principals: []
    };
  }

  componentWillMount() {
    this._getPricipals();
  }

  _getPricipals() {
    axios.get(this.state.url).then(res => {
      this.setState({ principals: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _edit(e) {
    this.props.history.push('/root/principal/edit/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getPricipals();
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

        <Table fixedHeader={true} height={this.state.tableHeight.toString()}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.alignLeft}>Principal name</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Domain</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Users</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Events</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Created at</TableHeaderColumn>
              <TableHeaderColumn style={styles.narrow}>Edit</TableHeaderColumn>
              <TableHeaderColumn style={styles.narrow}>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.principals.map((principal, i) =>
              <TableRow data-id={principal.id}>
                <TableRowColumn style={styles.alignLeft}>{principal.name}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{principal.domain}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}></TableRowColumn>
                <TableRowColumn style={styles.alignLeft}></TableRowColumn>
                <TableRowColumn style={styles.alignLeft}></TableRowColumn>
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

export default withRouter(Principal);

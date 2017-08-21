import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import RaisedButton from 'material-ui/RaisedButton';
import Delete from 'material-ui/svg-icons/action/delete';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './Users.css';

axios.defaults.withCredentials = true;

const utils = require('../../utils.js');
const config = require('../../config.json');
const styles = {
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflowX: 'hidden'
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

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight - 125,
      error: null,
      url: config.baseAPI_URL + '/user',
      users: []
    };
  }
  componentWillMount() {
    this._getUsers();
  }

  _getUsers() {
    axios.get(this.state.url).then(res => {
      this.setState({ users: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _getRoleNameById = (id) => {
    for (var i in config.roles) {
      if (config.roles[i].id === id) {
        return config.roles[i].name;
      }
    }
    return '';
  }

  _handlePageChange = () => {
    this.props.history.push('/manager/users/new');
  }

  _edit(e) {
    this.props.history.push('/manager/users/edit/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getUsers();
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _handleExportCSV() {
    utils.exportToCsv('users.csv', this.state.users);
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
        <div style={styles.root}>
          <ErrorReporting open={this.state.error !== null}
                          error={this.state.error} />

          <div>
            <div className="title">
              <h1>Users</h1>
              <div className="actions-container">
                <RaisedButton label="New User"
                              primary={true}
                              onTouchTap={this._handlePageChange.bind(this)} />
                <span className="separator"></span>
                <RaisedButton label="Export CSV"
                              className="export-csv"
                              primary={true}
                              onTouchTap={this._handleExportCSV.bind(this)} />
              </div>
            </div>  

            <Table fixedHeader={true} height={'"' + this.state.tableHeight.toString() + '"'}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={styles.alignLeft}>Username</TableHeaderColumn>
                  <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Email</TableHeaderColumn>
                  <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Role</TableHeaderColumn>
                  <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Create at</TableHeaderColumn>
                  <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
                  <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.users.map((user, i) =>
                  <TableRow key={i} data-id={user.id}>
                    <TableRowColumn style={styles.alignLeft}>{user.username}</TableRowColumn>
                    <TableRowColumn style={styles.alignLeft}>{user.email}</TableRowColumn>
                    <TableRowColumn style={styles.alignLeft}>{this._getRoleNameById(user.role_id)}</TableRowColumn>
                    <TableRowColumn style={styles.alignLeft}>{new Date(user.created_at).toJSON().slice(0,10).replace(/-/g,'/')}</TableRowColumn>
                    <TableRowColumn style={styles.narrowCenter} onTouchTap={this._edit.bind(this)}><ModeEdit/></TableRowColumn>
                    <TableRowColumn style={styles.narrowCenter} onTouchTap={this._delete.bind(this)}><Delete/></TableRowColumn>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>  
        </div>
      </div>
    )
  }
}

export default withRouter(Users);
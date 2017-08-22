import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './PrincipalManagers.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const styles = {
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

class PrincipalManagers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight - 125,
      error: null,
      managersUrl: config.baseAPI_URL + '/principal/',
      managers: []
    };
  }

  componentWillMount() {
    this._getManagers();
  }

  _getManagers() {
    axios.get(this.state.managersUrl + this.props.match.params.principalId + '/role/' + config.roles.manager.id + '/user').then(res => {
      this.setState({ managers: res.data });
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

        <div class="title">
          <h1>Managers</h1>
        </div>
        <Table fixedHeader={true} height={'"' + this.state.tableHeight.toString() + '"'}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.alignLeft}>Username</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Email</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Role</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Create at</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.managers.map((manager, i) =>
              <TableRow key={i} data-id={manager.id}>
                <TableRowColumn style={styles.alignLeft}>{manager.username}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{manager.email}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{this._getRoleNameById(manager.role_id)}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{new Date(manager.created_at).toJSON().slice(0,10).replace(/-/g,'/')}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withRouter(PrincipalManagers);

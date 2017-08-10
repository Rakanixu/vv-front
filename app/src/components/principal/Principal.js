import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './Principal.css';

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

      for (var i = 0; i < res.data.length; i++) {
        this._getUsersByPrincipal(res.data[i].id, i);
        this._getEventsByPrincipal(res.data[i].id, i);
      }
    }).catch(err => {
      this._handleError(err);
    });
  }

  _getUsersByPrincipal(principalId, i) {
    axios.get(this.state.url + '/' + principalId + '/user_count').then(function(res) {
      this.state.principals[i].userCount = res.data[0].count;
      this.setState({
        principals: this.state.principals
      });
    }.bind(this)).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _getEventsByPrincipal(principalId, i) {
    axios.get(this.state.url + '/' + principalId + '/event_count').then(res => {
      this.state.principals[i].eventCount = res.data[0].count;
      this.setState({
        principals: this.state.principals
      });
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

        <div class="title">
          <h1>Principals</h1>
        </div>
        <Table fixedHeader={true} height={'"' + this.state.tableHeight.toString() + '"'}>
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
              <TableRow key={i} data-id={principal.id}>
                <TableRowColumn style={styles.alignLeft}>{principal.name}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{principal.domain}</TableRowColumn>
                <TableRowColumn ref={'uc' + i} key={i} style={styles.alignLeft}>{principal.userCount}</TableRowColumn>
                <TableRowColumn ref={'ec' + i} key={i} style={styles.alignLeft}>{principal.eventCount}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{new Date(principal.created_at).toJSON().slice(0,10).replace(/-/g,'/')}</TableRowColumn>
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

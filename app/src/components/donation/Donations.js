import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import RaisedButton from 'material-ui/RaisedButton';
import Delete from 'material-ui/svg-icons/action/delete';
import ErrorReporting from 'material-ui-error-reporting';
import axios from 'axios';
import './Donations.css';

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
  }
};
var user = {};

class Donations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight - 125,
      error: null,
      url: config.baseAPI_URL + '/principal/',
      donations: []
    };
  }

  componentWillMount() {
    if (localStorage.getItem('alantu-user')) {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }
    this._getDonations();
  }

  _getDonations() {
    axios.get(this.state.url + user.principal_id + '/donation').then(res => {
      this.setState({ donations: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _handleExportCSV() {
    utils.exportToCsv('donations.csv', this.state.donations);
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
        <div style={styles.root}>
          <ErrorReporting open={this.state.error !== null}
            error={this.state.error} />

          <RaisedButton label="Export CSV"
                        className="export-csv"
                        primary={true}
                        fullWidth={true}
                        onTouchTap={this._handleExportCSV.bind(this)} />

          <Table fixedHeader={true} height={'"' + this.state.tableHeight.toString() + '"'}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={styles.alignLeft}>Amount</TableHeaderColumn>
                <TableHeaderColumn style={styles.alignLeft}>Donor</TableHeaderColumn>
                <TableHeaderColumn style={styles.alignLeft}>Source</TableHeaderColumn>
                <TableHeaderColumn style={styles.alignLeft}>Donated at</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.state.donations.map((donation, i) =>
                <TableRow key={i} data-id={donation.id}>
                  <TableRowColumn style={styles.alignLeft}>{donation.amount}</TableRowColumn>
                  <TableRowColumn style={styles.alignLeft}>{donation.firstname + donation.lastname}</TableRowColumn>
                  <TableRowColumn style={styles.alignLeft}>{donation.source}</TableRowColumn>
                  <TableRowColumn style={styles.alignLeft}>{new Date(donation.recurring_end).toJSON().slice(0,10).replace(/-/g,'/')}</TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

export default withRouter(Donations);
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './AdmissionsList.css';

axios.defaults.withCredentials = true;

const config = require('./../config.json');
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

class AdmissionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight - 125,
      error: null,
      url: config.baseAPI_URL + '/event/' + this.props.eventId + '/admission',
      admissions: []
    };
  }

  componentWillMount() {
    this._getAdmissions();
  }

  _getAdmissions() {
    axios.get(this.state.url).then(res => {
      this.setState({ admissions: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _edit(e) {
    this.props.history.push('/manager/event/edit/' + this.props.eventId + '/admission/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getAdmissions();
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
              <TableHeaderColumn style={styles.alignLeft}>Icon</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Title</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Subtitle</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Price</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Description</TableHeaderColumn>
              <TableHeaderColumn style={styles.narrow}>Edit</TableHeaderColumn>
              <TableHeaderColumn style={styles.narrow}>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.admissions.map((admission, i) =>      
              <TableRow key={i} data-id={admission.id}>
                <TableRowColumn style={styles.image}>
                  <img className="table-img"src={config.baseURL + admission.icon} alt="admission icon"/>
                  </TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{admission.title}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{admission.subtitle}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{admission.price}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{admission.description}</TableRowColumn>
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

export default withRouter(AdmissionsList);

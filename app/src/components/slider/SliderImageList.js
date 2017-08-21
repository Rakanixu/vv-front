import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import ErrorReporting from 'material-ui-error-reporting';
import './SliderImageList.css';

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

class SliderImageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeight: window.innerHeight - 125,
      error: null,
      openDialog: false,
      url: config.baseAPI_URL + '/event/' + this.props.eventId + '/image',
      images: []
    };
  }

  componentWillMount() {
    this._getImages();
  }

  _getImages() {
    axios.get(this.state.url).then(res => {
      this.setState({ images: res.data });
    }).catch(err => {
      this._handleError(err);
    });
  }

  _edit(e) {
    this.props.history.push('/manager/event/edit/' + this.props.eventId + '/image/' + e.currentTarget.parentNode.dataset.id);
  }

  _delete(e) {
    axios.delete(this.state.url + '/' + e.currentTarget.parentNode.dataset.id).then(function(res) {
      this._getImages();
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
              <TableHeaderColumn style={{width: '52px'}}>Image</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft}>Title</TableHeaderColumn>
              <TableHeaderColumn style={styles.alignLeft} className="column-fix-left-margin">Type</TableHeaderColumn>
              { !this.props.noEdit ? <TableHeaderColumn style={styles.narrow}></TableHeaderColumn> : null }
              <TableHeaderColumn style={styles.narrow}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.images.map((image, i) =>
              <TableRow key={i} data-id={image.id}>
                <TableRowColumn style={styles.tablePreview}>
                  <img className="table-img"src={config.baseURL + image.img} alt="event slider image"/>
                  </TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{image.title}</TableRowColumn>
                <TableRowColumn style={styles.alignLeft}>{image.type}</TableRowColumn>
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

export default withRouter(SliderImageList);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MediaGridList from './MediaGridList';
import RaisedButton from 'material-ui/RaisedButton';
import './Media.css';

const styles = {
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridList: {
    maxWidth: 1800,
    height: window.innerHeight - 200,
    overflowY: 'auto',
    padding: 50,
    paddingTop: 10,
    margin: 0,
    cols: (window.innerWidth > 1000) ? 2 : 1
  },
  buttonDelete: {
    top: 10,
    right: 10,
    position: 'absolute'
  },
  paperFab: {
    position: 'absolute',
    bottom: 80,
    right: 40
  }
};

class Media extends Component {
  _handlePageChange = () => {
    this.props.history.push('/manager/media/new');
  }

  render() {
    return (
      <div className="container">
        <div style={styles.root}>
          <div className="title">
            <h1>Medias</h1>
            <div className="actions-container">
              <RaisedButton label="Add Media"
                            primary={true}
                            onTouchTap={this._handlePageChange.bind(this)} />
            </div>
          </div>  

          <MediaGridList/>
        </div>
      </div>
    )
  }
}

export default withRouter(Media);
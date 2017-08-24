import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import ImgSelection from '../image/ImgSelection';
import axios from 'axios';
import './ImgSelectionWrapper.css';

axios.defaults.withCredentials = true;

const config = require('../../config.json');
const moment = require('moment');
let defaultPrincipalImage = '';
var user = {};

class ImgSelectionWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultImage: '',
      principalUrl: config.baseAPI_URL + '/principal',
    };
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem('alantu-user'))) {
      this._handleError(new Error('User cannot be retrieved'));
    } else {
      user = JSON.parse(localStorage.getItem('alantu-user'));
    }

    this._getPrincipal(user.principal_id);    
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.defaultImage !== prevProps.defaultImage && this.props.defaultImage) {
      this.setState({ defaultImage: this.props.defaultImage });
    }

    if (this.state.selectedImage !== prevState.selectedImage) {
      this.props.onChange(this.state.selectedImage);
    }
  }

  _getPrincipal = (id) => {
    axios.get(this.state.principalUrl + '/' + id).then(res => {
      defaultPrincipalImage = res.data.default_image;
      this.setState({ defaultImage: res.data.default_image });
    }).catch(function(err) {
      this._handleError(err);
    }.bind(this));
  }

  _onImageChange = (img) => {
    this.setState({ image: img });
    this.props.onChange(img);
  }

  _setDefaultImage = (e) => {
    this.setState({ image: defaultPrincipalImage });
  }

  render() {
    return (
      <div>
        <ImgSelection onChange={this._onImageChange.bind(this)} 
                      defaultImage={this.state.defaultImage} 
                      value={this.state.image}/>
        <div style={{ textAlign: 'center' }}>
          <RaisedButton label="Default Image"
                        primary={true}
                        onTouchTap={this._setDefaultImage.bind(this)} />
        </div>
      </div>
    );
  }
}

export default withRouter(ImgSelectionWrapper);

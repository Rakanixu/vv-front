import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import FacebookProvider, { Login } from 'react-facebook';
import RaisedButton from 'material-ui/RaisedButton';

class FbLogin extends Component {
  _handleResponse (res) {
    console.log(res);
  }

  _handleError (err) {
    console.log(err);
  }

  render() {
    return (
      <FacebookProvider appId="142063773068792">
        <Login scope="email"
               onResponse={this._handleResponse}
               onError={this._handleError}
               render={({ isLoading, isWorking, onClick }) => (
            <span onClick={onClick}>
              {(isLoading || isWorking) ? 
                <span>Loading...</span>
              :             
              <RaisedButton label="Login via Facebook"
                            primary={true} />}
            </span>
          )}>
        </Login>
    </FacebookProvider>
    );
  }
}

export default withRouter(FbLogin);

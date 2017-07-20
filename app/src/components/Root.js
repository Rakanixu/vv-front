import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import Principal from './Principal';
import NewPrincipal from './NewPrincipal';
import './Root.css';

class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path={`${this.props.match.path}`} component={Principal} />
          <Route exact path={`${this.props.match.path}/principal`} component={Principal} />
          <Route exact path={`${this.props.match.path}/principal/new`}  component={NewPrincipal} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Root);

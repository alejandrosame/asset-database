import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import * as actions from './store/actions';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Assets from './containers/Assets/Assets';
import Layout from './containers/Layout/Layout';

import './App.css';

const AsyncAuth = asyncComponent(() => {
  return import('./components/Auth/Auth');
});

class App extends React.Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={Assets} />
        <Route path="/private" exact render={() => {
          let content = <AsyncAuth />;
          if (this.props.isAuthenticated){
            content = <h1>Welcome to private area</h1>
          }
          return content;
        }} />
        <Redirect to="/" />
      </Switch>
    );

    return (
      <div className="App">
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

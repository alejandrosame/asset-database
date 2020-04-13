import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Assets from './containers/Assets/Assets';
import Layout from './containers/Layout/Layout';

import './App.css';

class App extends React.Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={Assets} />
        <Route path="/private" exact render={() => <h1>Welcome to admin area</h1>} />
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

export default App;

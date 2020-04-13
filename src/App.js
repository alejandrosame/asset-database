import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import asyncComponent from './hoc/asyncComponent/asyncComponent';

import './App.css';

const AsyncPrivate = asyncComponent(() => {
  return import('./containers/Private/Private');
});

const AsyncPublic = asyncComponent(() => {
  return import('./containers/Public/Public');
});

const App = () => {
  let routes = (
    <Switch>
      <Route path="/" exact component={AsyncPublic} />
      <Route path="/private" component={AsyncPrivate} />
      <Redirect to="/" />
    </Switch>
  );

  return (
    <div className="App">
      {routes}
    </div>
  );
}

export default App;

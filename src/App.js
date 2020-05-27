import React from 'react';
import Notifications from 'react-notify-toast';
import { Redirect, Route, Switch } from 'react-router-dom';

import asyncComponent from 'logic/hoc/asyncComponent';

import './App.css';

const AsyncPrivate = asyncComponent(() => {
  return import('pages/Private');
});

const AsyncPublic = asyncComponent(() => {
  return import('pages/Public');
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
      <Notifications />
      {routes}
    </div>
  );
}

export default App;

import React from 'react';

import NavigationItems from '../NavigationItems/NavigationItems';

import classes from './Toolbar.module.css';
import imgLogo from '../../../assets/logo-temp.png';

const toolbar = (props) => {
  console.log(props);

  let nav = null;
  if(props.isAuthenticated && props.match.path.includes("private")) {
    nav = (
      <nav className={classes.DesktopOnly}>
        <NavigationItems/>
      </nav>
    )
  }

  return (
    <header className={classes.Toolbar}>
      <div className={classes.Logo}>
        <img
          alt="Arcknight monsters"
          src={imgLogo}
        />
      </div>
      {nav}
    </header>
  );
}

export default toolbar;

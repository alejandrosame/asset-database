import React from 'react';

import NavigationItems from '../NavigationItems/NavigationItems';

import classes from './Toolbar.module.css';

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
          src="https://imgplaceholder.com/250x50/transparent/0b0a0a?text=Arcknight+Monsters&font-size=30"
        />
      </div>
      {nav}
    </header>
  );
}

export default toolbar;

import React from 'react';

import NavigationItems from 'components/navigation/NavigationItems';

import classes from './Toolbar.module.css';
import imgLogo from 'assets/logo-temp.png';

const toolbar = (props) => {
  let nav = null;
  if(props.isAuthenticated && props.match.path.includes("private")) {
    nav = (
      <nav className={classes.DesktopOnly}>
        <NavigationItems isAdmin={props.isAdmin} username={props.username} />
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

import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.module.css';

const navigationItems = (props) => {
  let userNav = null;
  if (props.isAdmin){
    userNav = <NavigationItem link="/private/users">Manage users</NavigationItem>;
  }

  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/private" exact>Edit assets</NavigationItem>
      <NavigationItem link="/private/images">Manage images</NavigationItem>
      <NavigationItem link="/private/tags">Manage tags</NavigationItem>
      {userNav}
      <NavigationItem link="/private/logout">Logout</NavigationItem>
    </ul>
  );
}

export default navigationItems;

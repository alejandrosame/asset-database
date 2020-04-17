import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.module.css';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/private" exact>Edit assets</NavigationItem>
    <NavigationItem link="/private/tags">Manage tags</NavigationItem>
    <NavigationItem link="/private/users">Manage users</NavigationItem>
    <NavigationItem link="/private/logout">Logout</NavigationItem>
  </ul>
);

export default navigationItems;

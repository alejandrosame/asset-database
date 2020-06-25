import React from 'react';

import NavigationItem from './NavigationItem';
import NavigationItemList from './NavigationItemList';

import classes from './NavigationItems.module.css';

const navigationItems = ({isAdmin, username}) => {
  let userNav = null;
  if (isAdmin){
    userNav = <NavigationItem link="/private/users">Manage users</NavigationItem>;
  }

  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/private" exact>Edit assets</NavigationItem>
      <NavigationItem link="/private/images">Manage images</NavigationItem>
      <NavigationItem link="/private/tags">Manage tags</NavigationItem>
      {userNav}
      <NavigationItemList title={username}
        itemList={[
          {text:"Change password", link:"/private/password-change", exact: false},
          {text:"Logout", link:"/private/logout", exact: false}
        ]}
      />
      {/* Dropdown */}
    </ul>
  );
}

export default navigationItems;

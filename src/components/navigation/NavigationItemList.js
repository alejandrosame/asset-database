import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {MdAccountCircle, MdKeyboardArrowUp, MdKeyboardArrowDown} from 'react-icons/md';

import classes from './NavigationItem.module.css';

const NavigationItemList = ( {title, itemList} ) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className={classes.NavigationItem}>
      <div className={classes.ListContainer}>
        <div className={classes.ListHeader} onClick={() => setIsOpen(!isOpen)}>
          <MdAccountCircle/>
          <span>{title}</span>
          {isOpen?<MdKeyboardArrowDown/>:<MdKeyboardArrowUp/>}
        </div>
        <ul className={[classes.List, isOpen?null:classes.Invisible].join(' ')}>
          {itemList.map(item =>
            <NavLink
              key={item.text}
              to={item.link}
              exact={item.exact}
              activeClassName={classes.active}
            >
              {item.text}
            </NavLink>
          )}
        </ul>
      </div>
    </li>
  );
}

export default NavigationItemList;

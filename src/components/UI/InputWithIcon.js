import React from 'react';

import { MdAdd, MdSearch } from 'react-icons/md';

import classes from './InputWithIcon.module.css';

const addTag = ({ keyUp, icon, placeholder }) => {
  let iconContent = null;
  switch (icon) {
    case 'add':
      iconContent = <MdAdd />;
      break;
    case 'search':
      iconContent = <MdSearch />;
      break;
    default:
      iconContent = <MdAdd />;
  }

  return (
    <div className={classes.InputWithIcon}>
      {iconContent}
      <input onKeyUp={keyUp} placeholder={placeholder} />
    </div>
  );
}


export default addTag;

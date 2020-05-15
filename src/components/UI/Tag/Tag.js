import React from 'react';

import { MdClear } from 'react-icons/md';

import classes from './Tag.module.css';

const tag = ({ children, onDelete, onClick }) => {
  let deleteIcon="";
  if (onDelete) {
    deleteIcon = <MdClear onClick={() => onDelete()} />;
  }

  return <span className={classes.Tag} onClick={() => onClick()}>
    <span>{children}</span>
    {deleteIcon}
  </span>
}


export default tag;

import React from 'react';

import { MdClear } from 'react-icons/md';

import classes from './Tag.module.css';

const tag = ({ children, onDelete, onClick }) => {
  let deleteIcon="";
  if (onDelete) {
    deleteIcon = <MdClear onClick={(e) => {onDelete(); e.stopPropagation();}} />;
  }

  let onClickFn = null;
  if(onClick) onClickFn = () => onClick();

  return <span className={classes.Tag} onClick={ onClickFn }>
    <span>{children}</span>
    {deleteIcon}
  </span>
}


export default tag;

import React from 'react';

import { MdClear } from 'react-icons/md';

import classes from './Tag.module.css';

const tag = ({ children, onDelete }) =>
  <span className={classes.Tag}>
    <span>{children}</span>
    <MdClear onClick={() => onDelete()} />
  </span>


export default tag;

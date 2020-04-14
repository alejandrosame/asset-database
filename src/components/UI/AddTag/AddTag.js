import React from 'react';

import { MdAdd } from 'react-icons/md';

import classes from './AddTag.module.css';

const addTag = ({ keyPressed }) =>
  <div className={classes.AddTag}>
    <MdAdd />
    <input
      onKeyPress={keyPressed}
      placeholder="Type and press enter"
    ></input>
  </div>


export default addTag;

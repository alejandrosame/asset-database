import React from 'react';

import classes from './CrossMark.module.css.module.css';

const crossMark = ({ clicked }) =>
  <span className={classes.CrossMark} onClick={clicked}></span>


export default crossMark;

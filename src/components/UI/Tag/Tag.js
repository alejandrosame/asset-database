import React from 'react';

import CrossMark from '../CrossMark/CrossMark';

import classes from './Tag.module.css';

const tag = ({ children, clicked }) =>
  <span className={classes.Tag}>
    <span>{children}</span>
    <CrossMark onClick={clicked} />
  </span>


export default tag;

import React from 'react';

import Button from 'components/UI/Button';

import classes from './AddModalSection.module.css';

const addModalSection = ({text, clicked}) =>
  <div className={classes.AddModalSection} onClick={clicked} >
    <Button buttonType="Success">{text}</Button>
  </div>

export default addModalSection;

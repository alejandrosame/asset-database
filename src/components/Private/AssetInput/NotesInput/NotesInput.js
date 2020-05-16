import React from 'react';

import * as classes from './NotesInput.module.css'

const note = ({value}) => <div className={classes.Parent}>
  <textarea
    className={classes.NotesInput}
    placeholder={"Input notes here..."}
    value={value}
  />
</div>


export default note;

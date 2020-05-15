import React from 'react';

import * as classes from './NotesInput.module.css'

const note = ({content}) => <div className={classes.Parent}>
  <textarea
    className={classes.NotesInput}
    placeholder="Input notes here..."
  >
    {content}
  </textarea>
</div>


export default note;

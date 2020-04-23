import React from 'react';

import classes from './TextList.module.css';

const textList = ({list, clicked}) =>
  list.map(element =>
    <span className={clicked ? classes.Tag : null}
      key={element}
      onClick={() => clicked ? clicked(element) : null}
    >
      {element}
    </span>
  )


export default textList;

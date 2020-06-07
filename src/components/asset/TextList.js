import React from 'react';

import { capitalize } from 'logic/shared/utility';

import classes from './TextList.module.css';

const textList = ({list=[], clicked, filtered}) =>
  list.map(element =>{
    let clsList = [classes.Base];
    if (clicked) clsList.push(classes.Tag);
    if (filtered && filtered.has(element)) clsList.push(classes.TagFiltered);

    return (
      <span className={clsList.join(' ')}
            key={element}
            onClick={() => clicked ? clicked(element) : null}
      >
        {capitalize(element)}
      </span>
    )}
  )


export default textList;

import React from 'react';

const textList = ({list, clicked}) =>
  list.map(element =>
    <span key={element} onClick={() => clicked ? clicked(element) : null} >
      {element}
    </span>
  )


export default textList;

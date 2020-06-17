import React from 'react';
import { addFinalStop } from 'logic/shared/utility';


const note = ({content, related}) => {
  return (
    <React.Fragment>
      <span key="notes">{addFinalStop(content)} </span>
      {related.map(e => <span key={e.ref}>See {e.name}. </span>)}
    </React.Fragment>

  );
}

export default note;

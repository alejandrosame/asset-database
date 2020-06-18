import React from 'react';
import { addFinalStop } from 'logic/shared/utility';

import Button from 'components/UI/Button';

const note = ({content, related=[], relatedFn=null}) => {
  return (
    <React.Fragment>
      <span key="notes">{addFinalStop(content)} </span>
      {related.map(e =>
        <Button
            key={e.ref}
            clicked={()=>relatedFn(e.ref)}
            buttonType={'Link'}
        >
          {`See ${e.name}. `}
        </Button>)}
    </React.Fragment>

  );
}

export default note;

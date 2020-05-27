import React from 'react';

import Notes from 'components/asset/Notes';
import TextList from 'components/asset/TextList';
import Viz from 'components/asset/Viz';


const assetMapper = () => {
  return {
    getId: (row) => row.id,
    renderColumns: (row) => [
      <Viz {...row} disabled />,
      <TextList list={[row.printSize]} />,
      <TextList list={[row.product]} />,
      <TextList list={row.tags} />,
      <Notes content={row.notes} />
    ]
  }
}

export default assetMapper;

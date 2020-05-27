import React from 'react';

import Notes from 'components/Public/Asset/Notes/Notes';
import TextList from 'components/Public/Asset/TextList/TextList';
import Viz from 'components/Public/Asset/Viz/Viz';


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

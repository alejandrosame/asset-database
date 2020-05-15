import React from 'react';

import Notes from '../../../../components/Public/Asset/Notes/Notes';
import TextList from '../../../../components/Public/Asset/TextList/TextList';
import Viz from '../../../../components/Public/Asset/Viz/Viz';

const assetMapper = () => (list) => list.map(element => {
  return {
    key: element.id,
    asset: <Viz {...element} disabled />,
    printSize: <TextList list={[element.printSize]} />,
    product: <TextList list={[element.product]} />,
    tags: <TextList list={element.tags} />,
    notes: <Notes content={element.notes} />
  }
});

export default assetMapper;

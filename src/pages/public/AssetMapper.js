import React from 'react';

import Notes from 'components/Public/Asset/Notes/Notes';
import TextList from 'components/Public/Asset/TextList/TextList';
import Viz from 'components/Public/Asset/Viz/Viz';


const assetMapper = (productFn, tagFn, productsFilter, tagsFilter) => {
  return {
    getId: (row) => row.id,
    renderColumns: (row) => [
      <Viz {...row} />,
      <TextList list={[row.printSize]} />,
      <TextList list={[row.product]} filtered={productsFilter} clicked={productFn} />,
      <TextList list={row.tags} filtered={tagsFilter} clicked={tagFn} />,
      <Notes content={row.notes} />
    ]
  }
}

export default assetMapper;

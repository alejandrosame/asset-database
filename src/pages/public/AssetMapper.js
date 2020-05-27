import React from 'react';

import Notes from 'components/asset/Notes';
import TextList from 'components/asset/TextList';
import Viz from 'components/asset/Viz';


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

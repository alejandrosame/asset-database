import React from 'react';

import Notes from 'components/asset/Notes';
import TextList from 'components/asset/TextList';
import Viz from 'components/asset/Viz';

import Backend from 'logic/backend/Backend';

const assetMapper = (productFn, tagFn, productsFilter, tagsFilter) => {
  const b = new Backend();
  return {
    getId: (row) => row.id,
    renderColumns: (row) => [
      <Viz baseImageURL={b.get_base_image_URL()} {...row} />,
      <TextList list={[row.printed_size]} />,
      <TextList list={row.products} filtered={productsFilter} clicked={productFn} />,
      <TextList list={row.tags} filtered={tagsFilter} clicked={tagFn} />,
      <Notes content={row.notes} />
    ]
  }
}

export default assetMapper;

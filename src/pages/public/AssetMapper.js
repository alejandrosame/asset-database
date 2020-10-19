import React from 'react';

import Notes from 'components/asset/Notes';
import TextList from 'components/asset/TextList';
import Viz from 'components/asset/Viz';

import Backend from 'logic/backend/Backend';

const assetMapper = (productFn, tagFn, relatedFn, productsFilter, tagsFilter, refs) => {
  const b = new Backend();
  return {
    getId: (row) => row.id,
    getRef: (row) => refs[row.id],
    renderColumns: (row) => [
      <Viz baseImageURL={b.get_base_image_URL()} {...row} />,
      <TextList list={[row.printed_size]} />,
      <TextList list={row.products} filtered={productsFilter} clicked={productFn} />,
      <TextList list={[...row.tags].sort()} filtered={tagsFilter} clicked={tagFn} />,
      <Notes content={row.notes} related={row.related_assets} relatedFn={relatedFn} />
    ]
  }
}

export default assetMapper;

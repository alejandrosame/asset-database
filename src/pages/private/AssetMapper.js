import React from 'react';

import Notes from 'components/asset/Notes';
import TextList from 'components/asset/TextList';
import Viz from 'components/asset/Viz';

import Backend from 'logic/backend/Backend';

const assetMapper = () => {
  const b = new Backend();
  return {
    getId: (row) => row.id,
    renderColumns: (row) => [
      <Viz baseImageURL={b.get_base_image_URL()} {...row} disabled />,
      <TextList list={[row.order.toString()]} />,
      <TextList list={[row.printed_size]} />,
      <TextList list={[row.display_size]} />,
      <TextList list={row.products} />,
      <TextList list={row.tags} />,
      <TextList list={row.related_assets.map(e => `${e.number}-${e.name}`)} />,
      <Notes content={row.notes} />
    ]
  }
}

export default assetMapper;

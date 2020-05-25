import React from 'react';

import Notes from '../../../../components/Public/Asset/Notes/Notes';
import TextList from '../../../../components/Public/Asset/TextList/TextList';
import Viz from '../../../../components/Public/Asset/Viz/Viz';

const assetMapper = (productFn, tagFn, productsFilter, tagsFilter) =>
  (list) => list.map(element => {
    return {
      key: element.id,
      asset: <Viz {...element} />,
      printSize: <TextList list={[element.printSize]} />,
    product: <TextList
                list={[element.product]}
                filtered={productsFilter}
                clicked={productFn}
              />,
      tags: <TextList
              list={element.tags}
              filtered={tagsFilter}
              clicked={tagFn}
            />,
      notes: <Notes content={element.notes} />
    }
});

export default assetMapper;

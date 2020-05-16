import React from 'react';

import DropdownInput from '../../../../components/Private/AssetInput/DropdownInput/DropdownInput';
import NotesInput from '../../../../components/Private/AssetInput/NotesInput/NotesInput';
import TagSelector from '../../../../components/Private/AssetInput/TagSelector/TagSelector';
import VizInput from '../../../../components/Private/AssetInput/VizInput/VizInput';

const assetMapper = (sizeOptions, productOptions, tagOptions) => (list) =>
  list.map(element => {
    return {
      key: element.id,
      asset: <VizInput {...element} />,
      printSize: <DropdownInput defaultValue={element.printSize} options={sizeOptions} />,
      product: <DropdownInput defaultValue={element.product} options={productOptions} />,
      tags: <TagSelector defaultValues={element.tags} options={tagOptions} />,
      notes: <NotesInput defaultValue={"Input notes here..."} value={element.notes} />
    }
});

export default assetMapper;

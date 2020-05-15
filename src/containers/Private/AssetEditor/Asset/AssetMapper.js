import React from 'react';

import DropdownInput from '../../../../components/Private/AssetInput/DropdownInput/DropdownInput';
import NotesInput from '../../../../components/Private/AssetInput/NotesInput/NotesInput';
import TagSelector from '../../../../components/Private/AssetInput/TagSelector/TagSelector';
import VizInput from '../../../../components/Private/AssetInput/VizInput/VizInput';

const assetMapper = () => (list) => list.map(element => {
  return {
    key: element.id,
    asset: <VizInput {...element} />,
    printSize: <DropdownInput defaultValue={element.printSize} options={["a", "b"]} />,
    product: <DropdownInput defaultValue={element.product} options={["a", "b"]} />,
    tags: <TagSelector defaultValues={element.tags} options={[{id: 1, value: "a"}, {id: 2, value: "b"}]} />,
    notes: <NotesInput content={element.notes} />
  }
});

export default assetMapper;

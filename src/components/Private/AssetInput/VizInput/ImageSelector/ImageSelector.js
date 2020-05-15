import React from 'react';

import ImageUploading from "react-images-uploading";

import Button from '../../../../UI/Button/Button';

//import classes from './Viz.module.css';

const imageMapper = (image) => (
  <div key={image.key}>
    <img src={image.dataURL} alt={image.key} width="100" />
    <Button
      buttonType="Success"
      clicked={image.onUpdate}
    >
      Update
    </Button>
    <Button
      buttonType="Danger"
      clicked={image.onRemove}
    >
      Remove
    </Button>
  </div>
);


const maxNumber = 1;
const maxMbFileSize = 10;

const imageSelector = ({ selectorText, onChangeFn, defaultValue }) => {

  return (
    <ImageUploading
      onChange={onChangeFn}
      maxNumber={maxNumber}
      defaltValue={defaultValue}
      multiple
      maxFileSize={maxMbFileSize}
      acceptType={["png"]}
    >
      {({ imageList, onImageUpload, onImageRemoveAll }) => {
        let content = (
          <Button
            buttonType="Success"
            clicked={onImageUpload}
          >
          {selectorText}
          </Button>
        );

        if (imageList.length > 0) {
          content = imageList.map(imageMapper);
        }

        return <div> {content} </div>;
      }}
    </ImageUploading>
  );
}


export default imageSelector;

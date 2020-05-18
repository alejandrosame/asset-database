import React from 'react';
import ImageUploading from "react-images-uploading";
import Modal from 'react-modal';

import Button from '../../UI/Button/Button';
import InputWithIcon from '../../UI/InputWithIcon/InputWithIcon';

import classes from './ImageUploaderModal.module.css';

const maxMbFileSize = 10;

const onChange = (imageList) => {
  // data for submit
  //console.log(imageList);
};

const processSide = (str) => {
  let value = "";
  switch(str.toLowerCase()) {
    case "a":
    case "front": {
      value = "front";
      break;
    }
    case "b":
    case "back": {
      value = "back";
      break;
    }
    default: {
      value = "undefined";
      break;
    }
  }
  return value;
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const imageUploaderModal = ({ isOpen, closeFn }) =>
  <Modal
    isOpen={isOpen}
    contentLabel="Image uploader"
    style={{
      content: {
        height:"700px",
        margin: "auto",
        textAlign: "center",
      }
    }}
  >
    <ImageUploading
      onChange={onChange}
      multiple
      maxFileSize={maxMbFileSize}
      acceptType={["png"]}
    >
      {({ imageList, onImageUpload, onImageRemoveAll }) =>
        <div>
            <div>
              <Button buttonType="Success" clicked={onImageUpload} >
                Select images to upload
              </Button>
              <Button buttonType="Danger" clicked={onImageRemoveAll} >
                Remove all images
              </Button>
            </div>

            <div>
              {imageList.map((image) => {
                const filename_splitted = image.file.name.split(" ");
                const name_splitted = filename_splitted[1].split("_");
                const number = filename_splitted[0]
                const name = name_splitted.slice(0,-1).join(" ");
                const side = name_splitted.slice(-1)[0].split(".")[0];
                return (
                  <div className={classes.ImageContainer} key={image.key}>
                    <img src={image.dataURL} alt={image.key} />
                    <div>{number}</div>
                    <div>{name}</div>
                    <div>{capitalize(processSide(side))}</div>
                    <div className={classes.RemoveButton} onClick={image.onRemove} >
                      x
                    </div>
                  </div>
                )
              })}
            </div>
        </div>
      }
    </ImageUploading>

    <div className={classes.CloseModal} onClick={() => closeFn()} >
      x
    </div>
  </Modal>


export default imageUploaderModal;

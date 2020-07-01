import React from 'react';
import Modal from 'react-modal';
import { MdClear } from 'react-icons/md';

import Button from 'components/UI/Button';

import classes from './SelectFilterTypeModal.module.css';

const selectFilterTypeModal = ({ showModal=false,
                                 tag, tagType,
                                 onShow, onHide, onCloseModal }) => {

  return (
    <React.Fragment >
      <Modal
        isOpen={showModal}
        contentLabel="Change password"
        style={{
          content: {
            width:"500px",
            height:"50px",
            margin: "auto",
            textAlign: "center",
          }
        }}
      >
        <MdClear
          className={classes.CloseModal}
          onClick={() => onCloseModal()}
        />

        <div>How do you want to filter the {tagType} <strong>{tag}</strong>?</div>
        <Button
          buttonType="Success"
          clicked={() => onShow(tag)}
        >
          Show
        </Button>
        <Button
          buttonType="Danger"
          clicked={() => onHide(tag)}
        >
          Hide
        </Button>

      </Modal>
    </React.Fragment>
  );
}

export default selectFilterTypeModal;

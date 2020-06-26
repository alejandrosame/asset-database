import React from 'react';
import Modal from 'react-modal';
import { MdClear } from 'react-icons/md';

import PasswordUpdater from 'components/Private/user/PasswordUpdater';

import classes from './UsersPasswordChangeModal.module.css';

const ChangePasswordModal = ({ showModal=false, username, onParentFetch }) => {
  return (
    <React.Fragment >
      <Modal
        isOpen={showModal}
        contentLabel="Change password"
        style={{
          content: {
            width:"400px",
            height:"220px",
            margin: "auto",
            textAlign: "center",
          }
        }}
      >
        <div className={classes.TitleModal} >Change password for user: {username}</div>
        <MdClear
          className={classes.CloseModal}
          onClick={() => onParentFetch()}
        />
        <PasswordUpdater callback={onParentFetch} username={username} />
      </Modal>
    </React.Fragment>
  );
}

export default ChangePasswordModal;

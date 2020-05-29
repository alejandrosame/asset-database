import React from 'react';
import Modal from 'react-modal';
import { MdClose } from 'react-icons/md';

import classes from './Viz.module.css';

Modal.setAppElement("#root");

class Viz extends React.Component {
  state = {
    showModal: false
  }

  isDisabled = () => {
    const {disabled, thumb_frontURL, thumb_backURL} = this.props;
    return disabled || thumb_frontURL === null || thumb_backURL === null;
  }

  handleOpenModal = () => {
    if (this.isDisabled()) return;
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { number, name, baseImageURL, thumb_frontURL, thumb_backURL,
            full_frontURL, full_backURL
          } = this.props;
    const placeholderName = [number, name].join('-');
    const numberName = [number, name].join(' ');
    const missingImage = <div className={classes.Missing} >?</div>;
    const frontThumb = (
      <img
        src={baseImageURL + thumb_frontURL}
        alt={placeholderName + " Front"}
      />
    );
    const backThumb = (
      <img
        src={baseImageURL + thumb_backURL}
        alt={placeholderName + " Back"}
      />
    );

    let classesArray = [];
    if (!this.isDisabled()) classesArray.push(classes.Enabled);

    return (
      <React.Fragment>
        <div className={classesArray.join(' ')} onClick={this.handleOpenModal}>
          {
            thumb_frontURL === null
              ? missingImage
              : frontThumb
          }
          {
            thumb_backURL === null
              ? missingImage
              : backThumb
          }
        </div>
        <div>{numberName}</div>

        <Modal
          isOpen={this.state.showModal}
          contentLabel={numberName}
          style={{
              content: {
                top: "80px"
              }
          }}
        >
          <div className={classes.TopBar}>
            <strong className={classes.AssetName} >{placeholderName}</strong>
            <MdClose className={classes.CloseModal} onClick={this.handleCloseModal} />
          </div>
          <div style={{
              height: "95%",
              textAlign: "center"
             }}
          >
            <img
              style={{maxHeight: "100%"}}
              src={baseImageURL + full_frontURL}
              alt={placeholderName + " Front"}
              />
            <img
              style={{maxHeight: "100%"}}
              src={baseImageURL + full_backURL}
              alt={placeholderName + "Back"}
              />
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}


export default Viz;

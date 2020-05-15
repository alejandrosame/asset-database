import React from 'react';
import Modal from 'react-modal';
import { MdClose } from 'react-icons/md';

import classes from './Viz.module.css';

const images = require.context('../../../../assets/art/', true);

Modal.setAppElement("#root");

class Viz extends React.Component {
  state = {
    showModal: false
  }

  handleOpenModal = () => {
    if (this.props.disabled) return;
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const placeholderName = [this.props.number, this.props.name].join('-');
    const numberName = [this.props.number, this.props.name].join(' ');

    return (
      <React.Fragment>
        <div className={classes.Img} onClick={this.handleOpenModal}>
          <img
            src={images(this.props.thumbA)}
            alt={placeholderName + " Front"}
          />
          <img
            src={images(this.props.thumbB)}
            alt={placeholderName + "Back"}
          />
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
              src={images(this.props.fullA)}
              alt={placeholderName + " Front"}
              />
            <img
              style={{maxHeight: "100%"}}
              src={images(this.props.fullB)}
              alt={placeholderName + "Back"}
              />
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}


export default Viz;

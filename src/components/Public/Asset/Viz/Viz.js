import React from 'react';
import Modal from 'react-modal';

const images = require.context('../../../../assets/art/', true);

class Viz extends React.Component {
  state = {
    showModal: false
  }

  handleOpenModal = () => {
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
        <div onClick={this.handleOpenModal}>
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
        >
          <button onClick={this.handleCloseModal}>Close</button>
          <div style={{ height: "95%", textAlign: "center" }}>
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

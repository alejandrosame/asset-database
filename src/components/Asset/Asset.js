import Modal from 'react-modal';
import React from 'react';

const images = require.context('../../assets/art/', true);

Modal.setAppElement('#root');

class Asset extends React.Component {
  state = {
    showModal: false
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render(){
    const placeholderName = [this.props.number, this.props.name].join('-');
    const numberName = [this.props.number, this.props.name].join(' ');

    return (
      <React.Fragment>
        <tr>
          <td>
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
          </td>
          <td>{this.props.printSize}</td>
          <td>{this.props.product}</td>
          <td>{this.props.tags.join(' ')}</td>
          <td>{this.props.notes}</td>
        </tr>
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

export default Asset;

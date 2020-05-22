import Modal from 'react-modal';
import React from 'react';

import AddModalSection from '../../UI/AddModalSection/AddModalSection';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';

import { checkValidity, updateObject, createControls } from '../../../shared/utility';

class CreateUserModal extends React.Component {
  constructor(props){
    super(props);

    this.state = {};
    this.state = updateObject(this.state, {
      controls: createControls([
        'email',
        {type: 'checkbox', name: 'isAdmin', label:'User has admin privileges'}
      ])
    });
    this.state = updateObject(this.state, {
      showModal: false
    });
  }

  state = {
    showModal: false
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      })
    });

    this.setState({controls: updatedControls});
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }
    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
      />
      )
    );

    return (
      <React.Fragment >
        <AddModalSection text="InviteUser" clicked={this.handleOpenModal}/>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Send user invitation"
          style={{
            content: {
              width:"400px",
              height:"250px",
              margin: "auto",
              textAlign: "center",
            }
          }}
        >
          <div>
            <h2>Send user invitation</h2>
            {form}
            <Button buttonType="Success">Send invite</Button>
              <Button
                buttonType="Danger"
                clicked={this.handleCloseModal}
              >
                Cancel
              </Button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateUserModal;

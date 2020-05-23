import Modal from 'react-modal';
import React from 'react';

import AddModalSection from '../../UI/AddModalSection/AddModalSection';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';

import { checkValidity, updateObject, createControls } from '../../../shared/utility';

class CreateUserModal extends React.Component {
  constructor(props){
    super(props);

    this.state = this.resetState();
  }

  resetState() {
    return {
      controls: createControls([
        {id: 'username', type: 'text', placeholder: 'Username'},
        {id: 'password', type: 'password'},
        {id: 'checkbox', type: 'checkbox', name: 'isAdmin', label:'User has admin privileges'}
      ]),
      showModal: false
    };
  }

  inputChangedHandler = (event, id) => {
    const updatedControls = {...this.state.controls}
    const updatedControl = updateObject(this.state.controls[id], {
      value: event.target.value,
      valid: checkValidity(
        event.target.value,
        this.state.controls[id].validation
      ),
      touched: true
    });
    updatedControls[id] = updatedControl;
    this.setState({controls: updatedControls});
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState(this.resetState());
  }

  mapControlToInput = (id) => {
    const config = this.state.controls[id];
    return <Input
      key={id}
      elementType={config.elementType}
      elementConfig={config.elementConfig}
      value={config.value}
      invalid={!config.valid}
      shouldValidate={config.validation}
      touched={config.touched}
      autocomplete={"new-password"}
      changed={(event) => this.inputChangedHandler(event, id)}
      />
  }

  render() {
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>
    }

    return (
      <React.Fragment >
        <AddModalSection text="Create user" clicked={this.handleOpenModal}/>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Create user account"
          style={{
            content: {
              width:"400px",
              height:"300px",
              margin: "auto",
              textAlign: "center",
            }
          }}
        >
          <div>
            <h2>Create new user account</h2>
            {errorMessage}
            <form onSubmit={this.submitHandler}>
              {this.mapControlToInput("username")}
              {this.mapControlToInput("password")}
              {this.mapControlToInput("checkbox")}
            </form>
            <Button buttonType="Success">Create user</Button>
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

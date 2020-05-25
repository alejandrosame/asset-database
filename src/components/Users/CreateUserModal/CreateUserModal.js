import Modal from 'react-modal';
import React from 'react';

import Backend from '../../../Backend/Backend';

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
    let value = event.target.value;
    if (id === 'checkbox') value = event.target.checked;
    const updatedControls = {...this.state.controls}
    const updatedControl = updateObject(this.state.controls[id], {
      value: value,
      valid: checkValidity(
        value,
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

  submitHandler = (event) => {
    event.preventDefault();

    const backend = new Backend();
    backend.insert_user(
      this.state.controls.username.value,
      this.state.controls.password.value,
      this.state.controls.checkbox.value
    )
    .then(response => {
      this.props.onParentFetch();
      this.handleCloseModal();
    })
    .catch(error => {
      if (error.response) error = error.response.data;
      this.setState({error: error});
    })
  }

  render() {
    let errorMessage = null;
    if (this.state.error) {
      errorMessage = <p>{this.state.error.message}</p>
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
              <Button buttonType="Success">Create user</Button>
              <Button
                buttonType="Danger"
                clicked={this.handleCloseModal}
              >
                Cancel
              </Button>
            </form>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateUserModal;

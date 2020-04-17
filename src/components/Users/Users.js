import Table from 'rc-table';
import Modal from 'react-modal';
import React from 'react';

import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import AddModalSection from '../UI/AddModalSection/AddModalSection';

import { checkValidity, updateObject, createControls } from '../../shared/utility';
import withAuth from '../../hoc/withAuth/withAuth';

import classes from './Users.module.css';


class Users extends React.Component {

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

    const columns = [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions'
      }
    ];

    const adminActions = (
      <React.Fragment>
        <Button buttonType="Danger">Revoke admin rights</Button>
        <Button buttonType="Danger">Delete account</Button>
      </React.Fragment>
    );

    const userActions = (
      <React.Fragment>
        <Button buttonType="Danger">Grant admin rights</Button>
        <Button buttonType="Danger">Delete account</Button>
      </React.Fragment>
    );

    const adminData = [
      { email: 'Jack@test.com',
        actions: adminActions,
        key: '1'
      },
      { email: 'Rose@test.com',
        actions: adminActions,
        key: '2'
      }
    ];

    const userData = [
      { email: 'Claire@test.com',
        actions: userActions,
        key: '1'
      },
      { email: 'Anthony@test.com',
        actions: userActions,
        key: '2'
      }
    ];

    return (
      <React.Fragment >

        <AddModalSection text="InviteUser" clicked={this.handleOpenModal}/>

        <Table
          className={classes.Table}
          title={() => <h2 className={classes['Table-title']}>Admins</h2>}
          columns={columns}
          data={adminData}
          prefixCls='Table'
        />

        <Table
          className={classes.Table}
          title={() => <h2 className={classes['Table-title']}>Other database users</h2>}
          columns={columns}
          data={userData}
          prefixCls='Table'
        />

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

export default withAuth(Users);

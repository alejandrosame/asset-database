import React from 'react';

import Backend from '../../Backend/Backend';

import Button from '../UI/Button/Button';
import Table from '../UI/Table/Table';

import CreateUserModal from './CreateUserModal/CreateUserModal';
import withAuth from '../../hoc/withAuth/withAuth';

import classes from './Users.module.css';
import genericPrivateTableClasses from '../UI/Table/styles/genericPrivate.module.css';


class Users extends React.Component {
  constructor(props){
    super(props);

    this.state = {};
    this.state['users'] = [];

    this.fetchData();
  }

  fetchData(){
    const backend = new Backend();
    backend.get_users()
      .then(response => this.setState({users: response.data.users}))
      .catch(error => console.log("Could not fetch user data: " + error))
  }

  rowRenderer = (admin) => {
    let actions = (
      <React.Fragment>
        <Button buttonType="Danger">Grant admin rights</Button>
        <Button buttonType="Danger">Delete account</Button>
      </React.Fragment>
    );

    if (admin) {
      actions = (
        <React.Fragment>
          <Button buttonType="Danger">Revoke admin rights</Button>
          <Button buttonType="Danger">Delete account</Button>
        </React.Fragment>
      );
    }

    return {
      getId: (row) => row.id,
      renderColumns: (row) => [actions, row.username]
    }
  }

  render() {
    const columnTitles = ['', 'Username'];
    const adminData = this.state.users.filter(user => user.admin);
    const userData = this.state.users.filter(user => !user.admin);

    return (
      <div className={classes.Page}>
        <div className={classes.Actions}>
          <CreateUserModal />
        </div>
        <div className={classes.Content}>
          <Table
            classModules={[classes, genericPrivateTableClasses]}
            title={"Admins"}
            columnTitles={columnTitles}
            showHeader={true}
            rowRenderer={this.rowRenderer(true)}
            data={adminData}
            />
          <Table
            classModules={[classes, genericPrivateTableClasses]}
            title={"Users"}
            columnTitles={columnTitles}
            showHeader={true}
            rowRenderer={this.rowRenderer()}
            data={userData}
            />
        </div>
      </div>
    );
  }
}

export default withAuth(Users);

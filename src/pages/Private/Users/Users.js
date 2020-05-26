import React from 'react';

import Backend from 'logic/backend/Backend';

import Button from 'components/UI/Button';
import Table from 'components/UI/Table';

import CreateUserModal from './CreateUserModal';
import withAuth from 'logic/hoc/withAuth/withAuth';

import classes from './Users.module.css';
import gptClasses from 'components/UI/styles/genericPrivateTable.module.css';


class Users extends React.Component {
  constructor(props){
    super(props);

    this.state = {};
    this.state['users'] = [];

    this.fetchData = this.fetchData.bind(this);
    this.fetchData();
  }

  fetchData(){
    const backend = new Backend();
    backend.get_users()
      .then(response => this.setState({users: response.data.users}))
      .catch(error => console.log("Could not fetch user data: " + error));
  }

  onUpdateUserAdminStatus = (id) => {
    const backend = new Backend();
    backend.update_user_admin_status(id)
      .then(response => this.fetchData())
      .catch(error => console.log("Could not update user admin status: " + error));
  }

  onDeleteUser = (id) => {
    const backend = new Backend();
    backend.delete_user(id)
      .then(response => this.fetchData())
      .catch(error => console.log("Could not delete user data: " + error));
  }

  rowRenderer = (admin) => {
    const renderActions = (id) => {
      const text = admin?"Revoke admin rights":"Grant admin rights";

      return (
        <React.Fragment>
          <Button
            buttonType="Danger"
            clicked={() => this.onUpdateUserAdminStatus(id)}
          >
            {text}
          </Button>
          <Button
            buttonType="Danger"
            clicked={() => this.onDeleteUser(id)}
          >
            Delete account
          </Button>
        </React.Fragment>
      );
    }

    return {
      getId: (row) => row.id,
      renderColumns: (row) => [renderActions(row.id), row.username]
    }
  }

  render() {
    const columnTitles = ['', 'Username'];
    const adminData = this.state.users.filter(user => user.admin);
    const userData = this.state.users.filter(user => !user.admin);

    return (
      <div className={classes.Page}>
        <div className={classes.Actions}>
          <CreateUserModal onParentFetch={this.fetchData} />
        </div>
        <div className={classes.Content}>
          <Table
            classModules={[classes, gptClasses]}
            title={"Admins"}
            columnTitles={columnTitles}
            showHeader={true}
            rowRenderer={this.rowRenderer(true)}
            data={adminData}
            />
          <Table
            classModules={[classes, gptClasses]}
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

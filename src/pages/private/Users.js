import React from 'react';
import {notify} from 'react-notify-toast';

import { getErrorMessage } from 'logic/shared/utility';

import Backend from 'logic/backend/Backend';

import Button from 'components/UI/Button';
import Table from 'components/UI/Table';

import ChangePasswordModal from './UsersPasswordChangeModal';
import CreateUserModal from './UsersCreateModal';
import withAuth from 'logic/hoc/withAuth';

import classes from './Users.module.css';
import gptClasses from 'components/UI/styles/genericPrivateTable.module.css';

class Users extends React.Component {
  constructor(props){
    super(props);

    this.state = this.resetState();

    this.fetchData = this.fetchData.bind(this);
    this.fetchData();
  }

  resetState(){
    return {
      users: [],
      showPasswordChangeModal: false,
      usernamePasswordChangeModal: ""
    }
  }

  fetchData(){
    const newState = this.resetState();
    const backend = new Backend();
    backend.get_users()
      .then(response => {
        newState["users"] = response.data.users;
        this.setState(newState);
      })
      .catch(error => notify.show(
        "Could not fetch user data: " + getErrorMessage(error),
        'error'
      ));
  }

  onUpdateUserAdminStatus = (id) => {
    const backend = new Backend();
    backend.update_user_admin_status(id)
      .then(response => this.fetchData())
      .catch(error =>  notify.show(
        "Could not update user admin status: " + getErrorMessage(error),
        'error'
      ));
  }

  onDeleteUser = (row) => {
    const shouldDelete = window.confirm(
      `Delete account for user '${row.username}'?`
    );
    if (!shouldDelete) {
      return;
    }

    const backend = new Backend();
    backend.delete_user(row.id)
      .then(response => this.fetchData())
      .catch(error => notify.show(
        "Could not delete user data: " + getErrorMessage(error),
        'error'
      ));
  }

  rowRenderer = (admin) => {
    const renderActions = (row) => {
      const text = admin?"Revoke admin rights":"Grant admin rights";

      return (
        <React.Fragment>
          <Button
            buttonType="Danger"
            clicked={() => this.onUpdateUserAdminStatus(row.id)}
          >
            {text}
          </Button>
          <Button
            buttonType="Danger"
            clicked={() => this.setState({
              usernamePasswordChangeModal: row.username,
              showPasswordChangeModal: true
            })}
          >
            Change password
          </Button>
          <Button
            buttonType="Danger"
            clicked={() => this.onDeleteUser(row)}
          >
            Delete account
          </Button>
        </React.Fragment>
      );
    }

    return {
      getId: (row) => row.id,
      renderColumns: (row) => [renderActions(row), row.username]
    }
  }

  render() {
    const columnTitles = ['', 'Username'];
    const adminData = this.state.users.filter(user => user.isAdmin);
    const userData = this.state.users.filter(user => !user.isAdmin);

    return (
      <div className={classes.Page}>
        <div className={classes.Actions}>
          <CreateUserModal onParentFetch={this.fetchData} />
          <ChangePasswordModal onParentFetch={this.fetchData}
            username={this.state.usernamePasswordChangeModal}
            showModal={this.state.showPasswordChangeModal}
          />
        </div>
        <div className={classes.Content}>
          <Table
            classModules={[classes, gptClasses]}
            title={"Admins"}
            showTitle={true}
            columnTitles={columnTitles}
            showHeader={true}
            rowRenderer={this.rowRenderer(true)}
            data={adminData}
            />
          <Table
            classModules={[classes, gptClasses]}
            title={"Users"}
            showTitle={true}
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

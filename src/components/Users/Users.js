import Table from 'rc-table';
import React from 'react';

import Button from '../UI/Button/Button';

import withAuth from '../../hoc/withAuth/withAuth';

import classes from './Users.module.css';


class Users extends React.Component {
  render() {
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
        <Button buttonType="Success">Invite user</Button>

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

      </React.Fragment>
    );
  }
}

export default withAuth(Users);

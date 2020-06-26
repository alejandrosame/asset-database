import React from 'react';
import { connect } from 'react-redux';

import withAuth from 'logic/hoc/withAuth';

import PasswordUpdater from 'components/Private/user/PasswordUpdater';

import classes from './PasswordChange.module.css';

const PasswordChange = ( {username} ) => {
  return <div className={classes.PasswordUpdaterContainer}>
    <PasswordUpdater username={username}/>
  </div>;
};

const mapStateToProps = state => {
  return {
    username: state.auth.username,
  }
}

export default connect(mapStateToProps, null)(withAuth(PasswordChange));

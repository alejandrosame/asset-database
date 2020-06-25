import React from 'react';
import { connect } from 'react-redux';

import withAuth from 'logic/hoc/withAuth';

import PasswordUpdater from 'components/Private/user/PasswordUpdater';

const PasswordChange = ( {username} ) => {
  return <PasswordUpdater username={username}/>;
};

const mapStateToProps = state => {
  return {
    username: state.auth.username,
  }
}

export default connect(mapStateToProps, null)(withAuth(PasswordChange));

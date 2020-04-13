import React from 'react';

import withAuth from '../../hoc/withAuth/withAuth';

class Users extends React.Component {
  render() {
    return (
      <React.Fragment >
        <h2>Welcome to user management</h2>
      </React.Fragment>
    );
  }
}

export default withAuth(Users);

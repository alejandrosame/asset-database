import React from 'react';

import withAuth from '../../hoc/withAuth/withAuth';

class AddAssets extends React.Component {
  render() {
    return (
      <React.Fragment >
        <h2>Welcome to assets creation</h2>
      </React.Fragment>
    );
  }
}

export default withAuth(AddAssets);

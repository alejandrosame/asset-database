import React from 'react';

import withAuth from '../../hoc/withAuth/withAuth';

class Tags extends React.Component {
  render() {
    return (
      <React.Fragment >
        <h2>Welcome to tag management</h2>
      </React.Fragment>
    );
  }
}

export default withAuth(Tags);

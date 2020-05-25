import React from 'react';

import Auth from 'pages/Private/Auth/Auth';

const withAuth = (Component) => (props) =>
  props.isAuthenticated
    ? <Component {...props} />
    : <Auth />;

export default withAuth;

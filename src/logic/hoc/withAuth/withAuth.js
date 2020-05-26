import React from 'react';

import Auth from 'pages/private/Auth';

const withAuth = (Component) => (props) =>
  props.isAuthenticated
    ? <Component {...props} />
    : <Auth />;

export default withAuth;

import React from 'react';

import Auth from '../../components/Auth/Auth';

const withAuth = (Component) => (props) =>
  props.isAuthenticated
    ? <Component {...props} />
    : <Auth />;

export default withAuth;

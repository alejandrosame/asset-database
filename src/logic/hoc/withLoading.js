import React from 'react';

const withLoading = (conditionFn) => (Component) => (props) => {
  let showLoading = null;
  if (conditionFn(props)){
    showLoading = <span>Loading...</span>
  }

  return (
    <React.Fragment>
      <Component {...props} />
      { showLoading }
    </React.Fragment>
  );
}

export default withLoading;

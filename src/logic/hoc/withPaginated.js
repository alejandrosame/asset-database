import React from 'react';

const withPaginated = (conditionFn) => (Component) => (props) =>
  {
    let showTryAgain = null;
    if (conditionFn(props)) {
      showTryAgain = (
        <div className="interactions">
          <div>
            Something went wrong...
          </div>
          <button
            type="button"
            onClick={props.onPaginatedSearch}
          >
            Try Again
          </button>
        </div>
      )
    }

    return (
      <React.Fragment>
        <Component {...props} />
        {showTryAgain}
      </React.Fragment>
    );
  }

export default withPaginated;

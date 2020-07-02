import React from 'react';
import VizSensor from 'react-visibility-sensor';

const withInfiniteScroll =
  (isItLoading, isItFinishedFetching, mustTriggerFetch) => (Component) => (props) =>
{
  const { onPaginatedSearch } = props;

  let endBlock = <VizSensor onChange={
       (isVisible) => isVisible && mustTriggerFetch(props) && onPaginatedSearch()
  } >
    <span>Loading...</span>
  </VizSensor>;

  if (isItLoading({...props})) {
    endBlock = <span>Loading...</span>;
  } else if (isItFinishedFetching({...props })){
    endBlock = <span>End of database</span>;
  }

  return (
    <React.Fragment>
      <Component {...props} />
      { endBlock }
    </React.Fragment>
  );
}

export default withInfiniteScroll;

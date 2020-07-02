import { compose } from 'recompose'

import Table from './Table';
import withInfiniteScroll from 'logic/hoc/withInfiniteScroll';
import withPaginated from 'logic/hoc/withPaginated';

const paginatedCondition = ({page, isLoading, isError}) =>
  page !== null && !isLoading && isError;

const mustTriggerFetch = ({
  data, loaderIsVisible, finished, isLoading, isError
}) => {
  return data.length
    && !finished
    && !isLoading
    && !isError;
}

const isItLoading = ({isLoading}) => {
  return isLoading;
}

const isItFinishedFetching = ({finished}) => {
  return finished;
}

const advancedTable = compose(
  withPaginated(paginatedCondition),
  withInfiniteScroll(isItLoading, isItFinishedFetching, mustTriggerFetch )
)(Table);

export default advancedTable;

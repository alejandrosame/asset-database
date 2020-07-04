import { compose } from 'recompose'

import Table from './Table';
import withInfiniteScroll from 'logic/hoc/withInfiniteScroll';
import withPaginated from 'logic/hoc/withPaginated';

const paginatedCondition = ({page, isLoading, isError}) =>
  page !== null && !isLoading && isError;

const mustTriggerFetch = ({
  data, loaderIsVisible, isFinished, isLoading, isError
}) => {
  return !isFinished
    && !isLoading
    && !isError;
}

const isItLoading = ({isLoading}) => {
  return isLoading;
}

const isItFinishedFetching = ({isFinished}) => {
  return isFinished;
}

const advancedTable = compose(
  withPaginated(paginatedCondition),
  withInfiniteScroll(isItLoading, isItFinishedFetching, mustTriggerFetch )
)(Table);

export default advancedTable;

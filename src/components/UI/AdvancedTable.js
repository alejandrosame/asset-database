import { compose } from 'recompose'

import Table from './Table';
import withInfiniteScroll from 'logic/hoc/withInfiniteScroll';
import withLoading from 'logic/hoc/withLoading';
import withPaginated from 'logic/hoc/withPaginated';

const paginatedCondition = ({page, isLoading, isError}) =>
  page !== null && !isLoading && isError;

const infiniteScrollCondition = ({data, isLoading, isError}) =>
  (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
  && data.length
  && !isLoading
  && !isError;

const loadingCondition = ({isLoading}) =>
  isLoading;

const advancedTable = compose(
  withPaginated(paginatedCondition),
  withInfiniteScroll(infiniteScrollCondition),
  withLoading(loadingCondition),
)(Table);

export default advancedTable;

import { compose } from 'recompose'

import Table from '../Table/Table';
import withInfiniteScroll from '../withInfiniteScroll/withInfiniteScroll';
import withLoading from '../withLoading/withLoading';
import withPaginated from '../withPaginated/withPaginated';

const paginatedCondition = props =>
  props.page !== null && !props.isLoading && props.isError;

const infiniteScrollCondition = props =>
  (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
  && props.list.length
  && !props.isLoading
  && !props.isError;

const loadingCondition = props =>
  props.isLoading;

const advancedTable = compose(
  withPaginated(paginatedCondition),
  withInfiniteScroll(infiniteScrollCondition),
  withLoading(loadingCondition),
)(Table);

export default advancedTable;

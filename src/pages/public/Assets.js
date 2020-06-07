import React from 'react';
import {notify} from 'react-notify-toast';

import assetMapper from './AssetMapper';
import FilterFeedback from './FilterFeedback';

import Table from 'components/UI/AdvancedTable';

import Backend from 'logic/backend/Backend';

import gptClasses from 'components/UI/styles/genericPublicTable.module.css';

const START_PAGE = 1;

const applyUpdateResult = (result) => (prevState) => ({
  hits: [...prevState.hits, ...result.hits],
  page: result.page,
  isError: false,
  isLoading: false,
});

const applySetResult = (result) => (prevState) => ({
  hits: result.hits,
  page: result.page,
  isError: false,
  isLoading: false,
});

const applySetError = (prevState) => ({
  isError: true,
  isLoading: false,
});

const intersects = (array, set) => {
  for (let val of array){
    if (set.has(val)) return true;
  }
  return false;
}

class Assets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hits: [],
      page: null,
      productsFilter: new Set(),
      tagsFilter: new Set(),
      isError: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchAssets(START_PAGE);
  }

  onPaginatedSearch = (e) =>
    this.fetchAssets(this.state.page + 1);

  fetchAssets = (page) => {
    const maxFetch = 10;
    const backend = new Backend();
    this.setState({ isLoading: true });

    backend.get_assets(maxFetch, page)
      .then(response => {
        const result = {
          hits: response.data.assets,
          page: page
        };
        this.onSetResult(result, page);
      })
      .catch(error => notify.show("Something went wrong. Please, refresh page."))
  }

  onSetError = () =>
    this.setState(applySetError);

  onSetResult = (result, page) =>
    page === START_PAGE
      ? this.setState(applySetResult(result))
      : this.setState(applyUpdateResult(result));

  onClickProduct = (value) => {
    const productsFilter = new Set(this.state.productsFilter);
    productsFilter.add(value);
    this.setState({ productsFilter: productsFilter })
  }

  onClickTag = (value) => {
    const tagsFilter = new Set(this.state.tagsFilter);
    tagsFilter.add(value);
    this.setState({ tagsFilter: tagsFilter })
  }

  onDeleteProduct = (value) => {
    const productsFilter = new Set(this.state.productsFilter);
    productsFilter.delete(value);
    this.setState({ productsFilter: productsFilter })
  }

  onDeleteTag = (value) => {
    const tagsFilter = new Set(this.state.tagsFilter);
    tagsFilter.delete(value);
    this.setState({ tagsFilter: tagsFilter })
  }

  filterHits = (hits) => {
    let filteredHits = hits;

    if (this.state.productsFilter.size > 0) {
      filteredHits = filteredHits
        .filter(f => this.state.productsFilter.has(f.product))
    }
    if (this.state.tagsFilter.size > 0) {
      filteredHits = filteredHits
        .filter(f => intersects(f.tags, this.state.tagsFilter))
    }
    return filteredHits;
  }

  render() {
    const columnTitles = ['Asset', 'Print Size', 'Product', 'Tags', 'Notes'];

    const mapper = assetMapper(this.onClickProduct, this.onClickTag,
                               this.state.productsFilter, this.state.tagsFilter);
    return (
      <React.Fragment>
        <FilterFeedback
          productsFilter={this.state.productsFilter}
          tagsFilter={this.state.tagsFilter}
          onDeleteProduct={this.onDeleteProduct}
          onDeleteTag={this.onDeleteTag}
        />
        <Table
          classModules={[gptClasses]}
          title={"Creatures"}
          showTitle={false}
          columnTitles={columnTitles}
          showHeader={false}
          rowRenderer={mapper}
          data={this.filterHits(this.state.hits)}
          isError={this.state.isError}
          isLoading={this.state.isLoading}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
        />
    </React.Fragment>
    );
  }
}
export default Assets;

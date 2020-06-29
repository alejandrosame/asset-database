import React from 'react';
import {notify} from 'react-notify-toast';

import assetMapper from './AssetMapper';
import FilterFeedback from './FilterFeedback';

import Table from 'components/UI/AdvancedTable';

import Backend from 'logic/backend/Backend';

import pageClasses from 'components/UI/styles/Page.module.css';
import gptClasses from 'components/UI/styles/genericPublicTable.module.css';

const START_PAGE = 1;

const createRefs = (list) => {
  return list.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});
}

const applyUpdateResult = (result) => (prevState) => {
  const newRefs = createRefs(result.hits);
  return {
    hits: [...prevState.hits, ...result.hits],
    refs: {...prevState.refs, ...newRefs},
    page: result.page,
    isError: false,
    isLoading: false,
  }
};

const applySetResult = (result) => (prevState) => {
  const newRefs = createRefs(result.hits);
  return {
    hits: result.hits,
    refs: newRefs,
    page: result.page,
    isError: false,
    isLoading: false,
  }
};

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
      refs: {},
      highlighted: null
    };
  }

  componentDidMount() {
    this.fetchAssets(START_PAGE);
  }

  onPaginatedSearch = (e) =>
    this.fetchAssets(this.state.page + 1);

  onAutomaticPaginatedSearch = (callback) => {
    this.fetchAssets(this.state.page + 1, callback);
  }

  fetchAssets = (page, callback=null) => {
    const maxFetch = 10;
    const backend = new Backend();
    this.setState({ isLoading: true });

    backend.get_assets(maxFetch, page)
      .then(response => {
        const result = {
          hits: response.data.assets,
          page: page
        };
        if (response.data.assets.length === 0) page = page-1;
        this.onSetResult(result, page);

        if (callback) {
          callback();
        }
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

  onClickRelated = (id) => {
    if (this.state.refs[id] === undefined) {
      this.onAutomaticPaginatedSearch(this.onClickRelated.bind(this, id));
      return;
    }
    setTimeout(() => {
      this.state.refs[id].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      this.setState({ highlighted: id });
      setTimeout(() => this.setState({ highlighted: null }), 6000);
    }, 200);
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
        .filter(f => intersects(f.products, this.state.productsFilter))
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
                               this.onClickRelated,
                               this.state.productsFilter, this.state.tagsFilter,
                               this.state.refs
                              );
    return (
      <React.Fragment>
        <div className={pageClasses.Page}>
          <div className={pageClasses.Actions}>
            <div>
              <FilterFeedback
                productsFilter={this.state.productsFilter}
                tagsFilter={this.state.tagsFilter}
                onDeleteProduct={this.onDeleteProduct}
                onDeleteTag={this.onDeleteTag}
              />
            </div>
          </div>
          <div className={pageClasses.Content}>
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
                highlighted={this.state.highlighted}
              />
          </div>
        </div>
    </React.Fragment>
    );
  }
}
export default Assets;

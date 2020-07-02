import React from 'react';
import {notify} from 'react-notify-toast';

import assetMapper from './AssetMapper';
import FilterFeedback from './FilterFeedback';
import SelectFilterTypeModal from './SelectFilterTypeModal';

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

const doesNotIntersect = (array, set) => {
  for (let val of array){
    if (set.has(val)) return false;
  }
  return true;
}

class Assets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hits: [],
      page: null,
      productsShowFilter: new Set(),
      tagsShowFilter: new Set(),
      productsHideFilter: new Set(),
      tagsHideFilter: new Set(),
      isError: false,
      isLoading: false,
      refs: {},
      highlighted: null,
      isModalOpen: false,
      onShowTagModal: null,
      onHideTagModal: null,
      clickedTagModal: null,
      clickedTagTypeModal: null
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

    backend.get_assets(
      maxFetch, page,
      [...this.state.productsShowFilter].join(','),
      [...this.state.productsHideFilter].join(','),
      [...this.state.tagsShowFilter].join(','),
      [...this.state.tagsHideFilter].join(',')
    )
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
    this.setState({
      isModalOpen: true,
      onShowTagModal: this.onClickShowProduct,
      onHideTagModal: this.onClickHideProduct,
      clickedTagModal: value,
      clickedTagTypeModal: "product"
    });
  }

  onClickTag = (value) => {
    this.setState({
      isModalOpen: true,
      onShowTagModal: this.onClickShowTag,
      onHideTagModal: this.onClickHideTag,
      clickedTagModal: value,
      clickedTagTypeModal: "tag"
    });
  }

  onClickShowProduct = (value) => {
    const productsShowFilter = new Set(this.state.productsShowFilter);
    productsShowFilter.add(value);
    this.setState({
      page: 1,
      isModalOpen: false,
      productsShowFilter: productsShowFilter })
  }

  onClickShowTag = (value) => {
    const tagsShowFilter = new Set(this.state.tagsShowFilter);
    tagsShowFilter.add(value);
    this.setState({
      page: 1,
      isModalOpen: false,
      tagsShowFilter: tagsShowFilter })
  }

  onClickHideProduct = (value) => {
    const productsHideFilter = new Set(this.state.productsHideFilter);
    productsHideFilter.add(value);
    this.setState({
      page: 1,
      isModalOpen: false,
      productsHideFilter: productsHideFilter })
  }

  onClickHideTag = (value) => {
    const tagsHideFilter = new Set(this.state.tagsHideFilter);
    tagsHideFilter.add(value);
    this.setState({
      page: 1,
      isModalOpen: false,
      tagsHideFilter: tagsHideFilter })
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

  onDeleteShowProduct = (value) => {
    const productsShowFilter = new Set(this.state.productsShowFilter);
    productsShowFilter.delete(value);
    this.setState({ productsShowFilter: productsShowFilter })
  }

  onDeleteShowTag = (value) => {
    const tagsShowFilter = new Set(this.state.tagsShowFilter);
    tagsShowFilter.delete(value);
    this.setState({ tagsShowFilter: tagsShowFilter })
  }

  onDeleteHideProduct = (value) => {
    const productsHideFilter = new Set(this.state.productsHideFilter);
    productsHideFilter.delete(value);
    this.setState({ productsHideFilter: productsHideFilter })
  }

  onDeletehideTag = (value) => {
    const tagsHideFilter = new Set(this.state.tagsHideFilter);
    tagsHideFilter.delete(value);
    this.setState({ tagsHideFilter: tagsHideFilter })
  }

  onOpenModal = () => {
    this.setState({ isModalOpen: true })
  }

  onCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    const columnTitles = ['Asset', 'Print Size', 'Product', 'Tags', 'Notes'];

    const mapper = assetMapper(this.onClickProduct, this.onClickTag,
                               this.onClickRelated,
                               this.state.productsShowFilter, this.state.tagsShowFilter,
                               this.state.refs
                              );

    return (
      <React.Fragment>
        <div className={pageClasses.Page}>
          <div className={pageClasses.Actions}>
            <div>
              <FilterFeedback
                productsShowFilter={this.state.productsShowFilter}
                tagsShowFilter={this.state.tagsShowFilter}
                productsHideFilter={this.state.productsHideFilter}
                tagsHideFilter={this.state.tagsHideFilter}
                onDeleteShowProduct={this.onDeleteShowProduct}
                onDeleteShowTag={this.onDeleteShowTag}
                onDeleteHideProduct={this.onDeleteHideProduct}
                onDeleteHideTag={this.onDeleteHideTag}
              />
            </div>
          </div>
          <div className={pageClasses.Content}>
              <SelectFilterTypeModal
                showModal={this.state.isModalOpen}
                onCloseModal={this.onCloseModal}
                tag={this.state.clickedTagModal}
                tagType={this.state.clickedTagTypeModal}
                onShow={this.state.onShowTagModal}
                onHide={this.state.onHideTagModal}
              />
              <Table
                classModules={[gptClasses]}
                title={"Creatures"}
                showTitle={false}
                columnTitles={columnTitles}
                showHeader={false}
                rowRenderer={mapper}
                data={this.state.hits}
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

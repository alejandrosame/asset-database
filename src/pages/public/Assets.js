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
    hits: result.page===START_PAGE?[...result.hits]:[...prevState.hits, ...result.hits],
    refs: result.page===START_PAGE?{...newRefs}:{...prevState.refs, ...newRefs},
    page: result.page,
    isFinished: result.hits.length === 0,
    isError: false,
    isLoading: false,
  }
};

const applySetError = (prevState) => ({
  isError: true,
  isLoading: false
});

class Assets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hits: [],
      page: START_PAGE-1,
      productsShowFilter: new Set(),
      tagsShowFilter: new Set(),
      productsHideFilter: new Set(),
      tagsHideFilter: new Set(),
      isError: false,
      isLoading: false,
      isFinished: false,
      refs: {},
      highlighted: null,
      isModalOpen: false,
      onShowTagModal: null,
      onHideTagModal: null,
      clickedTagModal: null,
      clickedTagTypeModal: null,
    };
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
      maxFetch, page, null,
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
    this.setState(applyUpdateResult(result));

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
      page: START_PAGE-1,
      isFinished: false,
      isModalOpen: false,
      productsShowFilter: productsShowFilter
    });
    setTimeout(() => this.fetchAssets(START_PAGE), 100);
  }

  onDeleteShowProduct = (value) => {
    const productsShowFilter = new Set(this.state.productsShowFilter);
    productsShowFilter.delete(value);
    this.setState({
      page: START_PAGE-1,
      isFinished: false,
      productsShowFilter: productsShowFilter
    });
    setTimeout(() => this.fetchAssets(START_PAGE), 100);
  }

  onClickShowTag = (value) => {
    const tagsShowFilter = new Set(this.state.tagsShowFilter);
    tagsShowFilter.add(value);
    this.setState({
      page: START_PAGE-1,
      isFinished: false,
      isModalOpen: false,
      tagsShowFilter: tagsShowFilter
    });
    setTimeout(() => this.fetchAssets(START_PAGE), 100);
  }

  onDeleteShowTag = (value) => {
    const tagsShowFilter = new Set(this.state.tagsShowFilter);
    tagsShowFilter.delete(value);
    this.setState({
      page: START_PAGE-1,
      isFinished: false,
      tagsShowFilter: tagsShowFilter
    });
    setTimeout(() => this.fetchAssets(START_PAGE), 100);
  }

  onClickHideProduct = (value) => {
    const productsHideFilter = new Set(this.state.productsHideFilter);
    productsHideFilter.add(value);
    this.setState({
      page: START_PAGE-1,
      isFinished: false,
      isModalOpen: false,
      productsHideFilter: productsHideFilter
    });
    setTimeout(() => this.fetchAssets(START_PAGE), 100);
  }

  onDeleteHideProduct = (value) => {
    const productsHideFilter = new Set(this.state.productsHideFilter);
    productsHideFilter.delete(value);
    this.setState({
      page: START_PAGE-1,
      isFinished: false,
      productsHideFilter: productsHideFilter
    });
    setTimeout(() => this.fetchAssets(START_PAGE), 100);
  }

  onClickHideTag = (value) => {
    const tagsHideFilter = new Set(this.state.tagsHideFilter);
    tagsHideFilter.add(value);
    this.setState({
      page: START_PAGE-1,
      isFinished: false,
      isModalOpen: false,
      tagsHideFilter: tagsHideFilter
    });
    setTimeout(() => this.fetchAssets(START_PAGE), 100);
  }

  onDeleteHideTag = (value) => {
    const tagsHideFilter = new Set(this.state.tagsHideFilter);
    tagsHideFilter.delete(value);
    this.setState({
      page: START_PAGE-1,
      isFinished: false,
      tagsHideFilter: tagsHideFilter
    });
    setTimeout(() => this.fetchAssets(START_PAGE), 100);
  }

  onClickRelatedStart = (id) => {
    if (this.state.highlighted) return;
    this.setState({ highlighted: id });

    this.onClickRelated(id, 200);
  }

  onClickRelated = (id, delay) => {
    if (this.state.refs[id] === undefined) {
      this.onAutomaticPaginatedSearch(this.onClickRelated.bind(this, id, 500));
      return;
    }
    setTimeout(() => {
      this.state.refs[id].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      setTimeout(() => this.setState({ highlighted: null }), 1500);
    }, delay);
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
                               this.onClickRelatedStart,
                               this.state.productsShowFilter, this.state.tagsShowFilter,
                               this.state.refs
                              );

    let filterFeedbackArea = <FilterFeedback
          productsShowFilter={this.state.productsShowFilter}
          tagsShowFilter={this.state.tagsShowFilter}
          productsHideFilter={this.state.productsHideFilter}
          tagsHideFilter={this.state.tagsHideFilter}
          onDeleteShowProduct={this.onDeleteShowProduct}
          onDeleteShowTag={this.onDeleteShowTag}
          onDeleteHideProduct={this.onDeleteHideProduct}
          onDeleteHideTag={this.onDeleteHideTag}
        />;

    return (
      <React.Fragment>
        <div className={pageClasses.Page}>
          {filterFeedbackArea}
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
                isFinished={this.state.isFinished}
                page={this.state.page}
                loaderIsVisible={this.state.loaderIsVisible}
                highlighted={this.state.highlighted}
                onPaginatedSearch={this.onPaginatedSearch}
              />
          </div>
        </div>
    </React.Fragment>
    );
  }
}
export default Assets;

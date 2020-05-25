import React from 'react';

import AdvancedTable from 'logic/hoc/AdvancedTable/AdvancedTable';
import assetMapper from './Asset/AssetMapper';
import Tag from 'components/UI/Tag/Tag';

import classes from './Assets.module.css';

import assetsData from 'assets/data/assets.json';

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
  state = {
    hits: [],
    page: null,
    productsFilter: new Set(),
    tagsFilter: new Set(),
    isError: false,
    isLoading: false,
  };

  componentDidMount() {
    this.fetchAssets(0);
  }

  onPaginatedSearch = (e) =>
    this.fetchAssets(this.state.page + 1);

  fetchAssets = (page) => {
    const numberFetched = 7;
    this.setState({ isLoading: true });

    setTimeout(
      () => {
        let minIndex = page*numberFetched;
        let maxIndex = minIndex+numberFetched;
        if (maxIndex > assetsData.length) maxIndex = assetsData.length;

        const result = {
          hits: assetsData.slice(minIndex, maxIndex),
          page: page
        };

        this.onSetResult(result, page);
      },
      1000
    )
  }

  onSetError = () =>
    this.setState(applySetError);

  onSetResult = (result, page) =>
    page === 0
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
    const mapper = assetMapper(this.onClickProduct, this.onClickTag,
                               this.state.productsFilter, this.state.tagsFilter);

    let filterAnnouncement = null;
    if (this.state.productsFilter.size + this.state.tagsFilter.size > 0){
      const productTags = [...this.state.productsFilter].map(element =>
        <Tag
          key={element}
          onDelete={() => this.onDeleteProduct(element)}
        >
          {element} (Product)
        </Tag>
      ).reduce( (arr, el) => {
      return arr.concat(el);
      }, [] )

      const tags = [...this.state.tagsFilter].map(element =>
        <Tag
          key={element}
          onDelete={() => this.onDeleteTag(element)}
        >
          {element}
        </Tag>
      ).reduce( (arr, el) => {
      return arr.concat(el);
      }, [] )

      filterAnnouncement = <div className={classes.Announcement}>
        <strong className={classes.AnnouncementText}>Currently only showing items that include:</strong> {productTags} {tags}
      </div>
    }
    return (
      <React.Fragment>
        {filterAnnouncement}
        <AdvancedTable
          list={mapper(this.filterHits(this.state.hits))}
          isError={this.state.isError}
          isLoading={this.state.isLoading}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
          showHeader={false}
        />
    </React.Fragment>
    );
  }
}
export default Assets;

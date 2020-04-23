import React from 'react';

import AdvancedTable from '../../../hoc/AdvancedTable/AdvancedTable';
import AddModalSection from '../../../components/UI/AddModalSection/AddModalSection';
import InputWithIcon from '../../../components/UI/InputWithIcon/InputWithIcon';

import assetMapper from './Asset/AssetMapper';
import withAuth from '../../../hoc/withAuth/withAuth';

import assetsData from '../../../assets/data/assets.json';

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

class Assets extends React.Component {
  state = {
    hits: [],
    page: null,
    filter: '',
    isError: false,
    isLoading: false,
    timeout: null
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

  onAddFilter = (filterValue) =>
    this.setState( { filter: filterValue } );

  filterAssets = (collection) =>
    collection.filter(asset =>
      this.state.filter === '' || (
        asset.number.toLowerCase().includes(this.state.filter.toLowerCase())
        || asset.name.toLowerCase().includes(this.state.filter.toLowerCase())
        || asset.product.toLowerCase().includes(this.state.filter.toLowerCase())
        || asset.tags.join(' ').toLowerCase().includes(this.state.filter.toLowerCase())
      )
    );

  onKeyUp = (event, actionFn) => {
    clearTimeout(this.state.timeout);

    const e = {...event};
    const timeout = setTimeout(() => actionFn(e.target.value), 500);

    this.setState( { timeout: timeout } );
  }

  render() {
    console.log(`'${this.state.filter}'`);
    const mapper = assetMapper((el) => console.log(el), (el) => console.log(el));
    return (
      <React.Fragment>
        <AddModalSection clicked={() => console.log("clicked")} text="Add assets" />
        <InputWithIcon
          icon='search'
          keyUp={(event) => this.onKeyUp(event, this.onAddFilter)}
          placeholder="Type to filter assets"
        />
        <AdvancedTable
          list={mapper(this.filterAssets(this.state.hits))}
          isError={this.state.isError}
          isLoading={this.state.isLoading}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
          showHeader={true}
        />
      </React.Fragment>
    );
  }
}

export default withAuth(Assets);

import React from 'react';

import AdvancedTable from '../../../hoc/AdvancedTable/AdvancedTable';
import assetMapper from './Asset/AssetMapper';

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


  render() {
    const mapper = assetMapper((el) => console.log(el), (el) => console.log(el));
    return (
      <AdvancedTable
        list={mapper(this.state.hits)}
        isError={this.state.isError}
        isLoading={this.state.isLoading}
        page={this.state.page}
        onPaginatedSearch={this.onPaginatedSearch}
        showHeader={false}
      />
    );
  }
}
export default Assets;

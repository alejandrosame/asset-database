import React from 'react';

import AdvancedTable from '../../hoc/AdvancedTable/AdvancedTable';
import Asset from '../../components/Asset/Asset';

import assetsData from '../../assets/data/assets.json';

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

        /*
        if (Math.random() > 0.9){
          console.log("success");
          this.onSetResult(result, page);
        } else {
          console.log("error");
          this.onSetError();
        }
        */
      },
      3000
    )

    /*
    fetch(getHackerNewsUrl(value, page))
      .then(response => response.json())
      .then(result => this.onSetResult(result, page))
      .catch(this.onSetError);
    */
  }

  onSetError = () =>
    this.setState(applySetError);

  onSetResult = (result, page) =>
    page === 0
      ? this.setState(applySetResult(result))
      : this.setState(applyUpdateResult(result));

  render() {
    return (
      <AdvancedTable
        RowComponent={Asset}
        list={this.state.hits}
        isError={this.state.isError}
        isLoading={this.state.isLoading}
        page={this.state.page}
        onPaginatedSearch={this.onPaginatedSearch}
      />
    );
  }
}
export default Assets;

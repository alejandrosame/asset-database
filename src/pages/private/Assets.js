import React from 'react';
import Modal from 'react-modal';

import AdvancedTable from 'logic/hoc/AdvancedTable/AdvancedTable';
import AddModalSection from 'components/UI/AddModalSection';
import InputWithIcon from 'components/UI/InputWithIcon/InputWithIcon';

import AssetEditor from 'components/AssetEditor/AssetEditor';
import assetMapper from './AssetMapper';
import withAuth from 'logic/hoc/withAuth/withAuth';

import assetsData from 'assets/data/assets.json';

Modal.setAppElement("#root");

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

const applyEditorSetResult = (result) => (prevState) => ({
  editorHits: result.hits,
  isError: false,
  isLoading: false,
});

const applySetError = (prevState) => ({
  isError: true,
  isLoading: false,
});

const onRowClick = (record, index) => {
  console.log(`Click nth(${index}) row of parent, record.name: ${record.key}`);

};

const getEmptyAsset = () => {
  return [{
      "id": '',
      "number": "",
      "name": "",
      "thumbA": "",
      "thumbB": "",
      "fullA": "",
      "fullB": "",
      "printSize": "",
      "product": "",
      "tags": [],
      "notes": ""
  }]
}

class Assets extends React.Component {
  state = {
    hits: [],
    editorHits: [],
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

  onSetEditorResult = (result) =>
    this.setState(applyEditorSetResult(result))

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

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    let assetEditor = (
      <AssetEditor
        data={getEmptyAsset()}
        cancelFn={this.handleCloseModal}
        acceptFn={this.handleCloseModal}
      />
    );

    const mapper = assetMapper((el) => console.log(el), (el) => console.log(el));
    return (
      <React.Fragment>
        <AddModalSection clicked={() => this.handleOpenModal()} text="Add assets" />
        <InputWithIcon
          icon='search'
          keyUp={(event) => this.onKeyUp(event, this.onAddFilter)}
          placeholder="Type to filter assets"
        />
        <AdvancedTable
          list={mapper(this.filterAssets(this.state.hits))}
          onRow={(record, index) => ({
            onClick: onRowClick.bind(null, record, index)
          })}
          isError={this.state.isError}
          isLoading={this.state.isLoading}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
          showHeader={true}
        />

        <Modal
          isOpen={this.state.showModal}
          contentLabel="Send user invitation"
          style={{
            content: {
              height:"700px",
              margin: "auto",
              textAlign: "center",
            }
          }}
        >
          {assetEditor}
        </Modal>
      </React.Fragment>
    );
  }
}

export default withAuth(Assets);

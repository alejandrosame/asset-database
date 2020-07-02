import React from 'react';
import Modal from 'react-modal';
import {notify} from 'react-notify-toast';

import assetMapper from './AssetMapper';
import Table from 'components/UI/AdvancedTable';

import InputWithIcon from 'components/UI/InputWithIcon';

import AssetUploaderModal from './AssetUploaderModal';
import AssetExporterModal from './AssetExporterModal';

import withAuth from 'logic/hoc/withAuth';
import Backend from 'logic/backend/Backend';

import gptClasses from 'components/UI/styles/genericPrivateTable.module.css';
import pageClasses from 'components/UI/styles/Page.module.css';

Modal.setAppElement("#root");

const START_PAGE = 1;

const applyUpdateResult = (result) => (prevState) => ({
  hits: [...prevState.hits, ...result.hits],
  page: result.page,
  isError: false,
  isLoading: false,
  finished: result.finished
});

const applySetResult = (result) => (prevState) => ({
  hits: result.hits,
  page: result.page,
  isError: false,
  isLoading: false,
  finished: result.finished
});

const applyEditorSetResult = (result) => (prevState) => ({
  editorHits: result.hits,
  isError: false,
  isLoading: false,
  finished: result.finished
});

const applySetError = (prevState) => ({
  isError: true,
  isLoading: false
});

const resetState = {
  hits: [],
  editorHits: [],
  page: null,
  filter: '',
  isError: false,
  isLoading: false,
  timeout: null,
  finished: false
 };

class Assets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...resetState};
    this.onReset = this.onReset.bind(this);
  }

  componentDidMount() {
    this.fetchAssets(START_PAGE);
  }

  onReset() {
    this.setState({...resetState});
    this.fetchAssets(START_PAGE);
  }

  onResetWithFilter = (filterValue) => {
    this.setState( { ...resetState, filter: filterValue } );
    this.fetchAssets(START_PAGE);
  }

  onPaginatedSearch = (e) =>
    this.fetchAssets(this.state.page + 1);

  fetchAssets = (page) => {
    const maxFetch = 10;
    const backend = new Backend();
    const { filter } = this.state;
    this.setState({ isLoading: true });

    backend.get_assets(maxFetch, page, filter)
      .then(response => {
        let finished = false;
        if (response.data.assets.length === 0) {
          page = page-1;
          finished = true;
        }

        const result = {
          hits: response.data.assets,
          page: page,
          finished: finished
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

  onSetEditorResult = (result) =>
    this.setState(applyEditorSetResult(result))

  onKeyUp = (event, actionFn) => {
    const e = {...event};
    if (e.target.value === this.state.filter) return;

    clearTimeout(this.state.timeout);

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
    const columnTitles = ["Asset", "Order", "Print Size", "Display Size", "Product",
    "Tags", "Related", "Notes"];

    const mapper = assetMapper();
    return (
      <div className={pageClasses.Page}>
        <div className={pageClasses.Actions}>
          <div>
            <InputWithIcon
              icon='search'
              keyUp={(event) => this.onKeyUp(event, this.onResetWithFilter)}
              placeholder="Type to filter assets"
            />
          </div>
          <div>
            <AssetUploaderModal onParentReset={this.onReset} />
          </div>
          <div>
            <AssetExporterModal />
          </div>
        </div>
        <div className={pageClasses.Content}>
          <Table
            classModules={[gptClasses]}
            title={"Creatures"}
            showTitle={false}
            columnTitles={columnTitles}
            showHeader={true}
            rowRenderer={mapper}
            data={this.state.hits}
            isError={this.state.isError}
            isLoading={this.state.isLoading}
            finished={this.state.finished}
            page={this.state.page}
            onPaginatedSearch={this.onPaginatedSearch}
          />
        </div>
      </div>
    );
  }
}

export default withAuth(Assets);

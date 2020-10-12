import update from 'immutability-helper';
import React from 'react';

import Backend from 'logic/backend/Backend';
import TagEditor from './TagEditor';
import Spinner from 'components/UI/Spinner/Spinner';

import withAuth from 'logic/hoc/withAuth';

const applySetResult = (result) => (prevState) => ({
  displaySizes: result.displaySizes,
  printedSizes: result.printedSizes,
  isError: false,
  isLoading: false,
});

const applySetCollection = (collection, newCollection) => (prevState) => ({
  [collection]: newCollection,
  isError: false,
  isLoading: false,
});

const applySetError = (prevState) => ({
  isError: true,
  isLoading: false,
});

class Sizes extends React.Component {
  state = {
    displaySizes: [],
    printedSizes: [],
    displaySizesFilter: '',
    printedSizesFilter: '',
    page: null,
    isError: false,
    isLoading: false,
  };

  componentDidMount() {
    this.fetchSizes();
  }

  fetchSizes = () => {
    this.setState({ isLoading: true });
    const backend = new Backend();

    let displaySizesData = [];
    let printedSizesData = [];
    backend.get_display_sizes()
      .then(response => {
        displaySizesData = response.data.display_sizes;

        backend.get_printed_sizes()
          .then(response => {
            printedSizesData = response.data.printed_sizes;

            const result = {
              displaySizes: displaySizesData.map(size => {
                return {
                  id: size.id,
                  value: size.name
              }}),
              printedSizes: printedSizesData.map(size => {
                return {
                  id: size.id,
                  value: size.name
              }})
            };

            this.onSetResult(result);
          })
          .catch( error => this.onSetError() );

      })
      .catch( error => this.onSetError() );
  }

  onSetError = () => this.setState(applySetError);

  onSetResult = (result) => this.setState(applySetResult(result));

  onSetCollection = (collection, newCollection) =>
    this.setState(applySetCollection(collection, newCollection));

  onKeyUp = (event, actionFn) =>
    event.key === 'Enter'
      ? actionFn(event.target.value)
      : null

  onAddTag = (collection) => (tagValue) => {
    this.setState({ isLoading: true });

    const found = this.state[collection].filter(size => size.value === tagValue);
    if (found.length > 0){
      this.setState({ isLoading: false });
      return;
    }

    const backend = new Backend();
    let request;
    if (collection === "displaySizes") {
      request = backend.insert_display_size(tagValue);
    } else {
      request = backend.insert_printed_size(tagValue);
    }

    request
      .then( response => {
        const newCollection = update(this.state[collection], {
          $push: [{
            id: response.data.id,
            value: tagValue
          }]}
        );
        this.onSetCollection(collection, newCollection);
      })
      .catch( error => this.onSetError() );
  }

  onDeleteTag = (collection) => (id) => {
    this.setState({ isLoading: true });
    const backend = new Backend();

    let request;
    if (collection === "displaySizes") {
      request = backend.delete_display_size(id);
    } else {
      request = backend.delete_printed_size(id);
    }

    request
      .then( response => {
        const newCollection = update(
          this.state[collection],
          {$set: this.state[collection].filter(item => item.id !== id)}
        );
        this.onSetCollection(collection, newCollection);
      })
      .catch( error => this.onSetError() );
  }

  onEditTag = (collection) => (id) => (tagValue) => {
    this.setState({ isLoading: true });
    const backend = new Backend();

    let request;
    if (collection === "displaySizes") {
      request = backend.update_display_size(id, tagValue);
    } else {
      request = backend.update_printed_size(id, tagValue);
    }

    request
      .then( response => {
        let newCollection = update(
          this.state[collection],
          {$set: this.state[collection].filter(item => item.id !== id)}
        );
        newCollection = update(newCollection, {
          $push: [{
            id: response.data.id,
            value: tagValue
          }]}
        );
        this.onSetCollection(collection, newCollection);
      })
      .catch( error => this.onSetError() );
  }

  onAddFilter = (collection) => (filterValue) =>
    this.setState( { [`${collection}Filter`]: filterValue } );

  filterTags = (collection) =>
    this.state[collection].filter(tag =>
      tag.value.toLowerCase()
      .includes(this.state[`${collection}Filter`].toLowerCase())
    );

  render() {
    let content = (
      <React.Fragment>
        <div>
          <TagEditor
            label="Printed Sizes"
            tags={this.filterTags("printedSizes")}
            onKeyUpAdd={(event) => this.onKeyUp(event, this.onAddTag("printedSizes"))}
            onKeyUpSearch={
              (event) => this.onKeyUp(event, this.onAddFilter("printedSizes"))
            }
            onDelete={(tagIdx) => this.onDeleteTag("printedSizes")(tagIdx)}
            onEdit={(tagIdx) => (value) =>               this.onEditTag("printedSizes")(tagIdx)(value)}
            canEdit={true}
          />
        </div>
        <div>
          <TagEditor
            label="Display Sizes"
            tags={this.filterTags("displaySizes")}
            onKeyUpAdd={(event) => this.onKeyUp(event, this.onAddTag("displaySizes"))}
            onKeyUpSearch={
              (event) => this.onKeyUp(event, this.onAddFilter("displaySizes"))
            }
            onDelete={(tagIdx) => this.onDeleteTag("displaySizes")(tagIdx)}
            onEdit={(tagIdx) => (value) =>               this.onEditTag("displaySizes")(tagIdx)(value)}
            canEdit={true}
          />
        </div>
      </React.Fragment>
    );
    if (this.state.isLoading){
      content = <Spinner />;
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

export default withAuth(Sizes);

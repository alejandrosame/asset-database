import update from 'immutability-helper';
import React from 'react';

import Backend from 'logic/backend/Backend';
import TagEditor from './TagEditor/TagEditor';
import Spinner from 'components/UI/Spinner/Spinner';

import withAuth from 'logic/hoc/withAuth/withAuth';

const applySetResult = (result) => (prevState) => ({
  tags: result.tags,
  products: result.products,
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

class Tags extends React.Component {
  state = {
    tags: [],
    products: [],
    tagsFilter: '',
    productsFilter: '',
    page: null,
    isError: false,
    isLoading: false,
  };

  componentDidMount() {
    this.fetchTags();
  }

  fetchTags = () => {
    this.setState({ isLoading: true });
    const backend = new Backend();

    let tagsData = [];
    let productsData = [];
    backend.get_tags()
      .then(response => {
        tagsData = response.data.tags;

        backend.get_products()
          .then(response => {
            productsData = response.data.products;

            const result = {
              tags: tagsData.map(tag => {
                return {
                  id: tag.id,
                  value: tag.name
              }}),
              products: productsData.map(product => {
                return {
                  id: product.id,
                  value: product.name
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
    const backend = new Backend();

    let request;
    if (collection === "tags") {
      request = backend.insert_tag(tagValue);
    } else {
      request = backend.insert_product(tagValue);
    }

    request
      .then( response => {
        const newCollection = update(this.state[collection], {
          $push: [{
            id: response.id,
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
    if (collection === "tags") {
      request = backend.delete_tag(id);
    } else {
      request = backend.delete_product(id);
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
            label="Products"
            tags={this.filterTags("products")}
            onKeyUpAdd={(event) => this.onKeyUp(event, this.onAddTag("products"))}
            onKeyUpSearch={
              (event) => this.onKeyUp(event, this.onAddFilter("products"))
            }
            onDelete={(tagIdx) => this.onDeleteTag("products")(tagIdx)}
          />
        </div>
        <div>
          <TagEditor
            label="Tags"
            tags={this.filterTags("tags")}
            onKeyUpAdd={(event) => this.onKeyUp(event, this.onAddTag("tags"))}
            onKeyUpSearch={
              (event) => this.onKeyUp(event, this.onAddFilter("tags"))
            }
            onDelete={(tagIdx) => this.onDeleteTag("tags")(tagIdx)}
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

export default withAuth(Tags);

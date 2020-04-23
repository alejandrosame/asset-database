import update from 'immutability-helper';
import React from 'react';

import TagEditor from './TagEditor/TagEditor';
import Spinner from '../UI/Spinner/Spinner';

import withAuth from '../../hoc/withAuth/withAuth';

import tagsData from '../../assets/data/tags.json';


const applySetResult = (result) => (prevState) => ({
  tags: result.tags,
  products: result.products,
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

    setTimeout(
      () => {
        const result = {
          tags: tagsData['tags'].map((value, idx) => {
            return {
              id: idx,
              value: value
          }}),
          products: tagsData['products'].map((value, idx) => {
            return {
              id: idx,
              value: value
          }})
        };

        this.onSetResult(result);
      },
      1500
    )
  }

  onSetError = () => this.setState(applySetError);

  onSetResult = (result) => this.setState(applySetResult(result));

  onKeyUp = (event, actionFn) =>
    event.key === 'Enter'
      ? actionFn(event.target.value)
      : null

  onAddTag = (collection) => (tagValue) =>{
    const lastItem = this.state[collection].slice(-1)[0];
    const newCollection = update(this.state[collection], {
      $push: [{
        id: lastItem? lastItem.id + 1 : 0,
        value: tagValue
      }]}
    );

    this.setState( { [collection]: newCollection } );
  }

  onDeleteTag = (collection) => (idx) => {
    const newCollection = update(this.state[collection], { $splice: [[idx, 1]] });
    this.setState( { [collection]: newCollection } );
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

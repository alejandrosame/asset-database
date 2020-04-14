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

  onSetError = () =>
    this.setState(applySetError);

  onSetResult = (result) => this.setState(applySetResult(result));

  onKeyPress = (event) => event.key === 'Enter'
    ? console.log(event.target.value)
    : null;

  render() {
    let content = (
      <React.Fragment>
        <h2>Welcome to tag management</h2>
        <div>
          <TagEditor
            label="Products"
            tags={this.state.products}
            onKeyPress={(event) => this.onKeyPress(event)}
          />
        </div>
        <div>
          <TagEditor
            label="Tags"
            tags={this.state.tags}
            onKeyPress={(event) => this.onKeyPress(event)}
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

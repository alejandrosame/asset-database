import React from 'react';

import assetMapper from './Asset/AssetMapper';
import Backend from 'logic/backend/Backend';

import Button from 'components/UI/Button';
import Table from 'components/UI/Table';

import * as classes from './AssetEditor.module.css';

const applySuccess = (sizeOptions, productOptions, tagOptions) => (prevState) => ({
  sizeOptions: sizeOptions,
  productOptions: productOptions,
  tagOptions: tagOptions,
  isError: false,
  isLoading: false,
});

const applyError = (prevState) => ({
  isError: true,
  isLoading: false,
});

class AssetEditor extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      hits: props.data,
      sizeOptions: [],
      productOptions: [],
      tagOptions: [],
      isError: false,
      isLoading: false,
      timeout: null
    };

  }

  componentDidMount() {
    this.setState({ isLoading: true });

    const backend = new Backend();
    let sizeOptions = backend.get_size_options();
    backend.get_products()
      .then(response => {
        const productOptions = response.data.products
          .map( product => product.name )
          .reduce( (arr, el) => arr.concat(el), [] );

        backend.get_tags()
          .then(response => {
            const tagOptions = response.data.tags
              .map(tag => { return {"id": tag.id, "value": tag.name} })
              .reduce( (arr, el) => arr.concat(el), [] );

            this.onSetSuccess(sizeOptions, productOptions, tagOptions);
          })
          .catch(error => {
            console.log("Error loading tags: " + error);
            this.onSetError();
          });
      })
      .catch(error => {
        console.log("Error loading products: " + error);
        this.onSetError();
      });
  }

  onSetError = () =>
    this.setState(applyError);

  onSetSuccess = (sizeOptions, productOptions, tagOptions) =>
    this.setState(applySuccess(sizeOptions, productOptions, tagOptions));

  render() {
    let content = "Loading";
    if (!this.state.isLoading) {
      const mapper = assetMapper( this.state.sizeOptions,
                                  this.state.productOptions,
                                  this.state.tagOptions );

      content = (
        <React.Fragment>
          <Table
            className={classes.Table}
            list={mapper(this.state.hits)}
            showHeader={true}
          />
          <Button
            buttonType="Success"
            clicked={this.props.acceptFn}
          >
            Create
          </Button>
          <Button
            buttonType="Danger"
            clicked={this.props.cancelFn}
          >
            Cancel
          </Button>
        </React.Fragment>
      )
    }else{
      if (this.state.isError) {
        content = "An error ocurred loading metadata options";
      }
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

export default AssetEditor;

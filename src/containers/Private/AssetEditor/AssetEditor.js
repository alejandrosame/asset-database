import React from 'react';

import assetMapper from './Asset/AssetMapper';

import Button from '../../../components/UI/Button/Button';
import Table from '../../../hoc/Table/Table';

import * as classes from './AssetEditor.module.css';

class AssetEditor extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      hits: props.data,
      isError: false,
      isLoading: false,
      timeout: null
    };
  }

  render() {
    const mapper = assetMapper((el) => console.log(el), (el) => console.log(el));
    return (
      <React.Fragment>
        <Table
          className={classes.Table}
          list={mapper(this.state.hits)}
          showHeader={true}
        />
        <Button buttonType="Success">Save</Button>
        <Button
          buttonType="Danger"
          clicked={this.handleCloseModal}
        >
          Cancel
        </Button>
      </React.Fragment>
    );
  }
}

export default AssetEditor;

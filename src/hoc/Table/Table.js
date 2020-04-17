import React from 'react';
import Table from 'rc-table';

import classes from './Table.module.css';

const columns = [
  {
    title: 'Asset',
    dataIndex: 'asset',
    key: 'asset'
  },
  {
    title: 'Print Size',
    dataIndex: 'printSize',
    key: 'printSize'
  },
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product'
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags'
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes'
  },
];

const table = ({ list, isLoading, page, onPaginatedSearch, showHeader }) => {

  let table = null;
  if(list.length !== 0){
    table = (
      <Table
        className={classes.Table}
        columns={columns}
        data={list}
        prefixCls='Table'
        showHeader={showHeader}
      />
    )
  }

  return (
    <React.Fragment>
      {table}
    </React.Fragment>
  );
}

export default table;

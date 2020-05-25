import React from 'react';
import Table from 'rc-table';

import classes from './Table.module.css';

const columns = [
  {
    title: 'Asset',
    dataIndex: 'asset',
    key: 'asset',
    width: 230,
    maxWidth: 230
  },
  {
    title: 'Print Size',
    dataIndex: 'printSize',
    key: 'printSize',
    width: 122,
    maxWidth: 122
  },
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
    width: 122,
    maxWidth: "25%"
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
    width: "33%",
    maxWidth: "33%"
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    width: "40%",
    maxWidth: "100%"
  },
];

const table = ({ list, isLoading, page, onPaginatedSearch, showHeader, onRow, className }) => {

  if (!className) className = classes.Table

  let table = null;
  if(list.length !== 0){
    table = (
      <Table
        className={className}
        columns={columns}
        data={list}
        onRow={onRow}
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

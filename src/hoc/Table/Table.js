import React from 'react';

import classes from './Table.module.css';

const table = ({ list, isLoading, page, onPaginatedSearch, RowComponent }) => {
  const rowsOutput = list.map(item =>
    <RowComponent
      key={item.id}
      {...item}
    />
  );

  return (
    <table className={classes.Table}>
      <tbody>
        {rowsOutput}
      </tbody>
    </table>
  );
}

export default table;

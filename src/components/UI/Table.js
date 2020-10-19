import React from 'react';

import classes from './Table.module.css';

const applyClass = (classModules) => (className) => {
  const modules = [classModules].concat(classModules);
  return modules.map(module =>  module[className]).join(" ");
}

const highlightRow = (id, idToHighlight) => {
  if (id === idToHighlight || parseInt(id) === idToHighlight) {
    return classes.Highlighted;
  }

  return null;
}

const table = ({
    classModules=[], title=null, columnTitles=[], showTitle=false, showHeader=false,
    rowRenderer,
    data,
    highlighted=null
  }) => {

  return (
    <div className={applyClass(classModules)("Table")}>
      <h2 className={showTitle?applyClass(classModules)("Title"):classes.Hidden}>{title}</h2>
      <div className={applyClass(classModules)("InnerRegion")}>
        <table>
          <thead className={showHeader?null:classes.Hidden}>
            <tr>
              {columnTitles.map((title, idx) => (
                <th key={idx}>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={rowRenderer['getId'](row)}
                  ref={rowRenderer['getRef']?rowRenderer['getRef'](row):null}
                  className={highlightRow(rowRenderer['getId'](row), highlighted)}
              >
                {rowRenderer.renderColumns(row).map((column, idx) => (
                  <td key={idx}>
                    {column}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default table;

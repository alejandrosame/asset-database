import React from 'react';

import InputWithIcon from 'components/UI/InputWithIcon/InputWithIcon';
import Tag from 'components/UI/Tag/Tag';

import classes from './TagEditor.module.css';


const tagEditor = ({ tags, label, onKeyUpAdd, onKeyUpSearch, onDelete }) =>
  <div className={classes.TagEditor}>
    <h2>{label}</h2>
    <div className={classes.ActionBar}>
      <InputWithIcon
        icon='add'
        keyUp={onKeyUpAdd}
        placeholder="Type to add tag"
      />

      <InputWithIcon
        icon='search'
        keyUp={onKeyUpSearch}
        placeholder="Type to filter tags"
      />
    </div>
    <div className={classes.Editor}>
      {
        tags.map(tag => {
          return (
            <Tag
              key={tag.id}
              onDelete={() => onDelete(tag.id)}
            >
              {tag.value}
            </Tag>
          );
        })
        .reduce( (arr, el) => {
          return arr.concat(el);
        }, [] )
      }
    </div>
  </div>


export default tagEditor;

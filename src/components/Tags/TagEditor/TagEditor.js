import React from 'react';

import InputWithIcon from '../../UI/InputWithIcon/InputWithIcon';
import Tag from '../../UI/Tag/Tag';

import classes from './TagEditor.module.css';


const tagEditor = ({ tags, label, onKeyPressAdd, onKeyPressSearch, onDelete }) =>
  <div className={classes.TagEditor}>
    <h2>{label}</h2>
    <div className={classes.ActionBar}>
      <InputWithIcon
        icon='add'
        keyPressed={onKeyPressAdd}
        placeholder="Type to add tag"
      />

      <InputWithIcon
        icon='search'
        keyPressed={onKeyPressSearch}
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

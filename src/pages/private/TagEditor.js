import React from 'react';

import InputWithIcon from 'components/UI/InputWithIcon';
import Tag from 'components/UI/Tag';

import classes from './TagEditor.module.css';

const confirmDeletion = (value, id, onDelete) => {
  const shouldDelete = window.confirm(`Delete '${value}'?`);
  if (shouldDelete) {
    onDelete(id);
  }
}

const tagEditor = ({ tags, label, onKeyUpAdd, onKeyUpSearch, onDelete, onEdit, canEdit }) =>
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
              id={tag.id}
              onDelete={() => confirmDeletion(tag.value, tag.id, onDelete) }
              onEdit={onEdit}
              editable={canEdit}
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

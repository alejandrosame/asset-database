import React from 'react';

import InputWithIcon from '../../UI/InputWithIcon/InputWithIcon';
import Tag from '../../UI/Tag/Tag';

import classes from './TagEditor.module.css';



const tagEditor = ({ tags, label, onKeyPressAdd, onKeyPressSearch }) =>
  <div className={classes.TagEditor}>
    <h2>{label}</h2>
    <div className={classes.Editor}>
      <div className={classes.ActionBar}>
        <InputWithIcon
          icon='add'
          keyPressed={onKeyPressAdd}/>

        <InputWithIcon
          icon='search'
          keyPressed={onKeyPressSearch} />
      </div>
      {
        tags.map(tag => {
          return <Tag key={tag.id}>{tag.value}</Tag>;
        })
        .reduce( (arr, el) => {
          return arr.concat(el);
        }, [] )
      }
    </div>
  </div>


export default tagEditor;

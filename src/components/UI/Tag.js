import React from 'react';

import ContentEditable from "react-contenteditable";

import { MdClear } from 'react-icons/md';

import classes from './Tag.module.css';


const tag = ({ children, id, onDelete, onClick, onEdit, editable = false }) => {
  let deleteIcon="";
  if (onDelete) {
    deleteIcon = <MdClear onClick={(e) => {onDelete(); e.stopPropagation();}} />;
  }

  let onClickFn = null;
  if(onClick) onClickFn = () => onClick();

  const handleChange = event => {
    if (event.key === 'Enter') {
      let value = event.target.innerText
      value = value.replace(/[^\x20-\x7E]/gmi, "");

      if (value !== children){
        const shouldUpdate = window.confirm(`Do you want to update from '${children}' to '${value}'?`);

        if (shouldUpdate) {
          onEdit(id)(value);
        } else {
          value = children;
        }
      }
  
      event.target.innerText = value;
    }
  }

  let content = <span>children</span>;
  if (onEdit) {
    content = <span>
      <ContentEditable
        html={children}
        disabled={!editable && onEdit != null}
        onKeyUp={onEdit?handleChange:null}
      />
  </span>;
  }

  return <span className={classes.Tag} onClick={ onClickFn }>
    {content}
    {deleteIcon}
  </span>
}


export default tag;

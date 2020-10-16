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
    const keyCode = event.keyCode || event.which

    // If enter is pressed
    if (keyCode === 13) {
      // Disable new line behaviour
      event.returnValue = false
      if (event.preventDefault){
        event.preventDefault();
      }

      // Confirm if user wants to update tag value to new value
      let value = event.target.innerText;

      if (value !== children){
        const shouldUpdate = window.confirm(`Do you want to update from '${children}' to '${value}'?`);

        if (shouldUpdate) {
          onEdit(id)(value);
        } else {
          event.target.innerText = children;
        }
      }
    }
  }

  let content = <span>{children}</span>;
  if (onEdit) {
    content = <span>
      <ContentEditable
        html={children}
        disabled={!editable && onEdit != null}
        onKeyPress={onEdit?handleChange:null}
      />
  </span>;
  }

  return <span className={classes.Tag} onClick={ onClickFn }>
    {content}
    {deleteIcon}
  </span>
}


export default tag;

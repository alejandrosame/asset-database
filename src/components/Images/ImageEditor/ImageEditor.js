import React from 'react';

import Button from '../../UI/Button/Button';
import InputWithIcon from '../../UI/InputWithIcon/InputWithIcon';

import classes from './ImageEditor.module.css';


const imageEditor = ({ images, label, onKeyUpSearch, onDelete }) =>
  <div className={classes.ImageEditor}>
    <h2>{label}</h2>
    <div className={classes.ActionBar}>
      <InputWithIcon
        icon='search'
        keyUp={onKeyUpSearch}
        placeholder="Type to filter tags"
      />
    </div>
    <div className={classes.Editor}>
      {
        images.map(image => {
          return (
            <div className={classes.Image} key={image.id}>
              <img src={image.url} alt={[image.number, image.name].concat(" ")}/>
              <span>{image.number}</span><span>{image.name}</span>
              <Button click={() => onDelete(image.id)}>Delete</Button>
            </div>
          );
        })
        .reduce( (arr, el) => {
          return arr.concat(el);
        }, [] )
      }
    </div>
  </div>


export default imageEditor;

import React from 'react';

import Button from 'components/UI/Button';
import InputWithIcon from 'components/UI/InputWithIcon';

import classes from './ImageEditor.module.css';

import { capitalize } from 'logic/shared/utility';

const imageEditor = ({ baseImageURL, images, label, onKeyUpSearch, onDelete }) =>
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
      <table className={classes.Table}>
        <thead>
          <tr>
            <th></th>
            <th className={classes.NumberColumn}>Number</th>
            <th className={classes.ImageColumn}>Image</th>
            <th className={classes.SideColumn}>Side</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {images.map(image => (
            <tr key={image.id}>
              <td>
                <Button
                  buttonType="Danger"
                  clicked={() => onDelete(image.id)}
                  >
                  Delete
                </Button>
              </td>
              <td>{image.number}</td>
              <td>
                <img src={baseImageURL+ image.thumbURL} alt={[image.number, image.name].concat(" ")}/>
              </td>
              <td>{capitalize(image.side)}</td>
              <td>{image.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>


export default imageEditor;

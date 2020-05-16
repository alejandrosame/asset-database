import React from 'react';

import * as classes from './DropdownInput.module.css'

const dropdownInput = ({ id, defaultValue, options }) => (
  <select
    className={classes.DropdownInput}
    id={id}
    defaultValue={defaultValue}
    value={defaultValue}
  >
    <option
      key=""
      value=""
      disabled
      hidden
    >
      Choose here
    </option>
    {
      options.map( (value) => {
        return <option
          key={value}
          value={value}
        >
          {value}
        </option>
      } )
    }
  </select>
)

export default dropdownInput;

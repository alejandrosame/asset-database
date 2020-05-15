import React from 'react';

import * as classes from './DropdownInput.module.css'

const dropdownInput = ({ id, defaultValue, options }) => (
  <select className={classes.DropdownInput} id={id} >
    <option
      key=""
      value=""
      selected={!options.includes(defaultValue)}
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
          selected={value === defaultValue}
        >
          {value}
        </option>
      } )
    }
  </select>
)

export default dropdownInput;

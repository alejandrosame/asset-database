import React from 'react';

import classes from './Input.module.css';

const input = (props) => {
  let inputElement = null;

  const inputClasses = [classes.InputElement];

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  switch (props.elementType) {
    case ('input'):
      inputElement = <input
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        autoComplete={props.autocomplete}
        onChange={props.changed}
      />;
      break;
    case ('textarea'):
      inputElement = <textarea
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed}
      />;
      break;
    case ('select'):
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          onChange={props.changed}
          value={props.value}
        >
          {props.elementConfig.options.map((option, index) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.displayValue}
            </option>
          ))}
        </select>
        );
      break;
    case ('checkbox'):
      inputElement = (
        <label>
          <input
            type={"checkbox"}
            {...props.elementConfig}
            value={props.elementConfig.name}
            onChange={props.changed}
          />
          {props.elementConfig.label}
        </label>
      );
      break;
    default:
      inputElement = <input
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed}
      />;
  }

  return (
    <div className={classes.Input} >
      <label className={classes.Label} >{props.label}</label>
      {inputElement}
    </div>
  );
}

export default input;

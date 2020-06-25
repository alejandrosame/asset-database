import React, { useState } from 'react';
import {notify} from 'react-notify-toast';

import Backend from 'logic/backend/Backend'
import { checkValidity, updateObject, createControls } from 'logic/shared/utility';

import Button from 'components/UI/Button';
import Input from 'components/UI/Input';

import classes from './PasswordUpdater.module.css';


const PasswordUpdater = ( {username} ) => {
  const [controls, setControls] = useState(createControls([
    {id: 'password', type: 'password'},
    {id: 'confirm-password', type: 'password'}
  ]));

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(controls, {
      [controlName]: updateObject(controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          controls[controlName].validation
        ),
        touched: true
      })
    });

    setControls(updatedControls);
  }

  const submitHandler = (event) => {
    event.preventDefault();

    if (controls['password'].value !== controls['confirm-password'].value) {
      const msg = "Password mismatched. Please type them again.";
      notify.show(msg, 'error');
      return;
    }

    const b = new Backend();
    b.update_password(username, controls['password'].value)
      .then(response => {
        const msg = "Password updated succesfully.";
        notify.show(msg, 'success');
      })
      .catch(error => {
        let msg = [`Unexpected error updating password: ${error}.`,"\nPlease, try again."];
        if ("message" in error.response.data) {
          msg = [`Error found updating password: ${error.response.data.message}.`];
        }
        notify.show(msg.join(" "), 'error');
      })
  }

  const formElementsArray = [];
  for (let key in controls) {
    formElementsArray.push({
      id: key,
      config: controls[key]
    });
  }
  let form = formElementsArray.map(formElement => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={(event) => inputChangedHandler(event, formElement.id)}
    />
    )
  );

  return (
    <div className={classes.PasswordUpdater}>
      <form onSubmit={submitHandler}>
        {form}
        <Button buttonType="Success">Update password</Button>
      </form>
    </div>
  );
}

export default PasswordUpdater;

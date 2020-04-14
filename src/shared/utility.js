export const updateObject = (oldObject, updatedProperties) => {
  return {
      ...oldObject,
      ...updatedProperties
  };
};

export const checkValidity = (value, rules) => {
  let isValid = true;
  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value.trim() !== '' && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid
  }

  return isValid;
}

const createControl = (controlType) => {
  switch (controlType) {
    case 'email':
      return {
        email: {
          elementType: 'input',
          elementConfig: {
            type: 'email',
            placeholder: 'Email address'
          },
          value: '',
          validation: {
            required: true,
            isEmail: true
          },
          valid: false,
          touched: false
        }
      }
    case 'password':
      return {
        password: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'Password'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6

          },
          valid: false,
          touched: false
        }
      }
    default:
      return {
        input: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Write something'
          },
          value: '',
          validation: {
            required: false
          },
          valid: false,
          touched: false
        }
      }
  }
}

export const createControls = (controls) => {
  let ctrls = {};

  for (let idx in controls){
    ctrls = updateObject(ctrls, createControl(controls[idx]));
  }

  return ctrls;
}
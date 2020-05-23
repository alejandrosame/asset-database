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

const createControl = (control) => {
  let content = null;
  switch (control.type) {
    case 'text':
      content = {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: control.placeholder
        },
        value: '',
        validation: {
          required: true,
          maxLength: 255
        },
        valid: false,
        touched: false
      }
      break;
    case 'email':
      content = {
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
      break;
    case 'password':
      content = {
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
      break;
    case 'checkbox':
      content = {
        elementType: 'checkbox',
        elementConfig: {
          name: control.name,
          label: control.label
        },
        value: '',
        valid: false,
        touched: false
      }
      break;
    default:
      content = {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Write something'
        },
        value: '',
        validation: {
          required: true,
          maxLength: 255
        },
        valid: false,
        touched: false
      }
      break;
  }
  return content;
}

export const createControls = (controls) => {
  var output = {};
  for (let ctrl of controls) output[ctrl.id]=createControl(ctrl);
  return output;
}

export const checkEnv = (requiredEnv) => {
  let unsetEnv = requiredEnv.filter((env) => !(typeof process.env[env] !== 'undefined'));

  if (unsetEnv.length > 0) {
    throw new Error("Required ENV variables are not set: [" + unsetEnv.join(', ') + "]");
  }
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

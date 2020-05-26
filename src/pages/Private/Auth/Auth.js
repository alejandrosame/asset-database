import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from 'components/UI/Button';
import Input from 'components/UI/Input';
import Spinner from 'components/UI/Spinner/Spinner';

import { checkValidity, updateObject, createControls } from 'logic/shared/utility';
import * as actions from 'logic/store/actions';

import classes from './Auth.module.css';

class Auth extends React.Component {
  constructor(props){
    super(props);

    this.state = {};
    this.state = updateObject(this.state, {
      controls: createControls([
        {id: 'username', type: 'text', placeholder: 'Username'},
        {id: 'password', type: 'password'}
      ])
    });
  }

  componentDidMount() {
    if (this.props.authRedirectPath !== '/private') {
      this.props.onSetAuthRedirectPath();
    }
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      })
    });

    this.setState({controls: updatedControls});
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.username.value,
      this.state.controls.password.value
    );
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
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
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
      />
      )
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button buttonType="Success">Log in</Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password) =>
      dispatch(actions.login(email, password)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/private'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);

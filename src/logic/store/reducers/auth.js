import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  token: null,
  userId: null,
  username: null,
  isAdmin: null,
  error: null,
  loading: false,
  authRedirectPath: '/'
}

const authStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
}

const authObject = (action) => {
  return {
    token: action.idToken,
    userId: action.userId,
    username: action.username,
    isAdmin: action.isAdmin,
    error: null,
    loading: false
  };
}

const authSuccess = (state, action) => {
  return updateObject(state, authObject(action));
}

const authRenew = (state, action) => {
  return updateObject(state, authObject(action));
}

const authFailure = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
}

const authLogout = (state, action) => {
  return updateObject(state, initialState);
}

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, {
    authRedirectPath: action.path
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_RENEW: return authRenew(state, action);
    case actionTypes.AUTH_FAILURE: return authFailure(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
    default: return state;
  }
}

export default reducer;

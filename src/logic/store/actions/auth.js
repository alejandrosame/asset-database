import * as actionTypes from './actionTypes';
import Backend from 'logic/backend/Backend';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

const authObject = (type) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('isAdmin');

  return {
    type: type,
    idToken: token,
    userId: userId,
    username: username,
    isAdmin: isAdmin === null?false:JSON.parse(isAdmin)
  };
}

export const authSuccess = () => {
  return authObject(actionTypes.AUTH_SUCCESS);
};

export const authRenew = () => {
  return authObject(actionTypes.AUTH_SUCCESS);
};

export const authFailure = (error) => {
  return {
    type: actionTypes.AUTH_FAILURE,
    error: error
  };
};

export const logout = () => {
  clearTimeouts();
  localStorage.clear();
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

const processAuthResponse = (response) => {
  const { token, id, isAdmin, username, expiresIn } = response.data;
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  localStorage.setItem('token', token);
  localStorage.setItem('expirationDate', expirationDate);
  localStorage.setItem('userId', id);
  localStorage.setItem('username', username);
  localStorage.setItem('isAdmin', isAdmin);

  return { token, id, isAdmin, expiresIn };
}

export const login = (id, password) => {
  const backend = new Backend();
  return dispatch => {
    dispatch(authStart());

    backend.login(id, password)
      .then(response => {
        processAuthResponse(response);
        dispatch(authSuccess());
        dispatch(handleAutoLogout());
      })
      .catch(error => {
        console.log(error);
        dispatch(authFailure(error.response.data.error));
      });
  };
};

const renewToken = () => {
  const shouldRenew = () => localStorage.getItem('token') !== null;
  const backend = new Backend();
  return dispatch => {
    if (!shouldRenew()) return;
    backend.renew()
      .then(response => {
        processAuthResponse(response);
        dispatch(authRenew());
        dispatch(handleAutoLogout());
      })
      .catch(error => {
        if (error.response) console.log("Failed ", error.response.data.message)
        else console.log("Failed ", error.message)
      })
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate > new Date()) {
        dispatch(authSuccess());
        dispatch(handleAutoLogout());
      } else {
        dispatch(logout());
      }
    }
  };
}

const handleAutoLogout = () => {
  const expirationDate = new Date(localStorage.getItem('expirationDate'));
  const secondsToExpire = (expirationDate.getTime() - new Date().getTime()) / 1000;
  const renewBeforeXminutes = 5; // 5 minutes before autologout
  const secondsToRenew = secondsToExpire - renewBeforeXminutes*60;
  return dispatch => {
    clearTimeouts();

    localStorage.setItem('renewTimeout',
      setTimeout(
        () => dispatch(renewToken()),
        secondsToRenew * 1000
      )
    );

    localStorage.setItem('logoutTimeout',
      setTimeout(
        () => dispatch(logout()),
        secondsToExpire * 1000
      )
    );
  }
}

const clearTimeouts = () => {
  clearTimeout(localStorage.getItem("logoutTimeout"));
  clearTimeout(localStorage.getItem("renewTimeout"));
}

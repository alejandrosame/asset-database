import * as actionTypes from './actionTypes';
import Backend from 'logic/backend/Backend';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const authRenew = (token, userId) => {
  return {
    type: actionTypes.AUTH_RENEW,
    idToken: token,
    userId: userId
  };
};

export const authFailure = (error) => {
  return {
    type: actionTypes.AUTH_FAILURE,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  clearTimeouts();
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

const processAuthResponse = (response) => {
  const { token, id, expiresIn } = response.data;
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  localStorage.setItem('token', token);
  localStorage.setItem('expirationDate', expirationDate);
  localStorage.setItem('userId', id);

  return { token, id, expiresIn };
}

export const login = (id, password) => {
  const backend = new Backend();
  return dispatch => {
    dispatch(authStart());

    backend.login(id, password)
      .then(response => {
        processAuthResponse(response);
        const { token, id, expiresIn } = response.data;
        dispatch(authSuccess(token, id));
        dispatch(handleLogout(expiresIn));
      })
      .catch(error => {
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
        const { token, id, expiresIn } = response.data;
        dispatch(authRenew(token, id));
        dispatch(handleLogout(expiresIn));
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
        const userId = localStorage.getItem('userId');
        const expiresIn = (expirationDate.getTime() - new Date().getTime()) / 1000;
        dispatch(authSuccess(token, userId));
        dispatch(handleLogout(expiresIn));
      } else {
        dispatch(logout());
      }
    }
  };
}

const handleLogout = (secondsToExpire) => {
  const renewBefore = 5; // 5 minutes before autologout
  const secondsToRenew = secondsToExpire - renewBefore * 60;
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

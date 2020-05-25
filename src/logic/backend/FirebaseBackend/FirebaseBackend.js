import axios from 'axios';


class FirebaseBackend {
  constructor() {
    this.instances = {};
    this.instances["auth"] = axios.create({
      baseURL: process.env.REACT_APP_FIREBASE_BACKEND_AUTH_URL
    });
    this.instances["database"] = axios.create({
      baseURL: process.env.REACT_APP_FIREBASE_BACKEND_DATABASE_URL
    });

    this.instances["auth"].interceptors.request.use((config) => {
        config.params = config.params || {};
        config.params['key'] = process.env.REACT_APP_FIREBASE_BACKEND_APP_ID;
        return config;
    });
  }

  login(email, password) {
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }

    let url = '/accounts:signInWithPassword';
    return this.instances["auth"].post( url, authData );
  }

}

export default FirebaseBackend;

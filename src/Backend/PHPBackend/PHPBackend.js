import axios from 'axios';

class PHPBackend {
  constructor(){
    this.instances = {};
    this.instances["base"] = axios.create({
      baseURL: process.env.REACT_APP_PHP_BACKEND_BASE_URL
    });
  }

  login(email, password) {
    const authData = {
      email: email,
      password: password
    }

    let url = '/api/auth/login.php';
    return this.instances["base"].post( url, authData );
  }
}

export default PHPBackend;

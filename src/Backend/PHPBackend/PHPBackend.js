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

  get_tags() {
    let url = '/api/tag/read.php';
    return this.instances["base"].post( url );
  }

  get_products() {
    let url = '/api/product/read.php';
    return this.instances["base"].post( url );
  }

  get_size_options() {
    return ["Small", "Medium", "Huge"];
  }

  insert_tag(value) {
    const data = {
      "name": value
    }

    let url = '/api/tag/create.php';
    return this.instances["base"].post( url, data );
  }

  insert_product(value) {
    const data = {
      "name": value
    }

    let url = '/api/product/create.php';
    return this.instances["base"].post( url, data );
  }

  delete_tag(id) {
    const data = {
      "id": id
    }

    let url = '/api/tag/delete.php';
    return this.instances["base"].post( url, data );
  }

  delete_product(id) {
    const data = {
      "id": id
    }

    let url = '/api/product/delete.php';
    return this.instances["base"].post( url, data );
  }
}

export default PHPBackend;

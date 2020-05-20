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

  get_base_image_URL(){
    return this.instances["base"].defaults.baseURL;
  }

  get_tags() {
    let url = '/api/tag/read.php';
    return this.instances["base"].get( url );
  }

  get_products() {
    let url = '/api/product/read.php';
    return this.instances["base"].get( url );
  }

  get_images() {
    let url = '/api/image/read.php';
    return this.instances["base"].get( url );
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

  upload_image(file, number, name, side) {
    const url = '/api/image/upload.php';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('number', number);
    formData.append('name', name);
    formData.append('side', side);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return this.instances["base"].post( url, formData, config );
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

  delete_image(id) {
    const data = {
      "id": id
    }

    let url = '/api/image/delete.php';
    return this.instances["base"].post( url, data );
  }
}

export default PHPBackend;

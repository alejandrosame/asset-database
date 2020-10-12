import axios from 'axios';

class PHPBackend {
  constructor(){
    this.instances = {};
    this.instances["public"] = axios.create({
      baseURL: process.env.REACT_APP_PHP_BACKEND_BASE_URL
    });
    this.instances["private"] = axios.create({
      baseURL: process.env.REACT_APP_PHP_BACKEND_BASE_URL
    });

    this.instances["private"].interceptors.request.use(
      config => {
        if (!config.headers.Authorization) {
          const token = localStorage.getItem('token');

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      error => Promise.reject(error)
    );
  }

  login(id, password) {
    const authData = {
      username: id,
      password: password
    }

    let url = '/api/auth/login.php';
    return this.instances["public"].post( url, authData );
  }

  renew() {
    let url = '/api/auth/renewToken.php';
    return this.instances["private"].get( url );
  }

  get_base_image_URL(){
    return this.instances["public"].defaults.baseURL;
  }

  get_assets(maxFetch=null, page=null,
    searchTerm=null,
    showProducts=null, hideProducts=null,
    showTags=null, hideTags=null
  ) {
    if (page === null) {
      const url = '/api/asset/read.php';
      return this.instances["public"].get( url );
    }

    if (showProducts === "") showProducts=null;
    if (hideProducts === "") hideProducts=null;
    if (showTags === "") showTags=null;
    if (hideTags === "") hideTags=null;
    if (searchTerm === "") searchTerm=null;

    const data = {
      params: {
        page: page,
        pageSize: maxFetch,
        showProducts: showProducts,
        hideProducts: hideProducts,
        showTags: showTags,
        hideTags: hideTags,
        searchTerm: searchTerm
      }
    }

    const url = '/api/asset/readPage.php';
    return this.instances["public"].get( url, data );
  }

  search_asset_upsert(number, order) {
    const data = {
      params: {
        number: number,
        order: order
      }
    }

    const url = '/api/asset/searchUpsert.php';
    return this.instances["private"].get( url, data );
  }

  get_tags() {
    let url = '/api/tag/read.php';
    return this.instances["private"].get( url );
  }

  get_products() {
    let url = '/api/product/read.php';
    return this.instances["private"].get( url );
  }

  get_display_sizes() {
    let url = '/api/displaySize/read.php';
    return this.instances["private"].get( url );
  }

  get_printed_sizes() {
    let url = '/api/printedSize/read.php';
    return this.instances["private"].get( url );
  }

  get_images() {
    let url = '/api/image/read.php';
    return this.instances["private"].get( url );
  }

  get_users() {
    let url = '/api/user/read.php';
    return this.instances["private"].get( url );
  }

  insert_tag(value) {
    const data = {
      "name": value
    }

    let url = '/api/tag/create.php';
    return this.instances["private"].post( url, data );
  }

  insert_product(value) {
    const data = {
      "name": value
    }

    let url = '/api/product/create.php';
    return this.instances["private"].post( url, data );
  }

  insert_display_size(value) {
    const data = {
      "name": value
    }

    let url = '/api/displaySize/create.php';
    return this.instances["private"].post( url, data );
  }

  insert_printed_size(value) {
    const data = {
      "name": value
    }

    let url = '/api/printedSize/create.php';
    return this.instances["private"].post( url, data );
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
    return this.instances["private"].post( url, formData, config );
  }

  insert_user(username, password, admin) {
    const data = {
      "username": username,
      "password": password,
      "admin": admin.toString()
    }

    let url = '/api/user/create.php';
    return this.instances["private"].post( url, data );
  }

  insert_asset(asset) {
    let url = '/api/asset/create.php';
    return this.instances["private"].post( url, asset );
  }

  update_asset(data) {
    let url = '/api/asset/update.php';
    return this.instances["private"].post( url, data );
  }

  export_assets() {
    let url = '/api/asset/export.php';
    return this.instances["private"].post( url, null );
  }

  update_password(username, password) {
    const data = {
      "username": username,
      "password": password
    }

    let url = '/api/user/changePassword.php';
    return this.instances["private"].post( url, data );
  }

  update_user_admin_status(id) {
    const data = {
      "id": id
    }

    let url = '/api/user/changeAdminStatus.php';
    return this.instances["private"].post( url, data );
  }

  update_tag(id, name) {
    const data = {
      "id": id,
      "name": name
    }

    let url = '/api/tag/update.php';
    return this.instances["private"].post( url, data );
  }

  update_product(id, name) {
    const data = {
      "id": id,
      "name": name
    }

    let url = '/api/product/update.php';
    return this.instances["private"].post( url, data );
  }

  delete_asset(id) {
    const data = {
      "id": id
    }

    let url = '/api/asset/delete.php';
    return this.instances["private"].post( url, data );
  }

  delete_tag(id) {
    const data = {
      "id": id
    }

    let url = '/api/tag/delete.php';
    return this.instances["private"].post( url, data );
  }

  delete_product(id) {
    const data = {
      "id": id
    }

    let url = '/api/product/delete.php';
    return this.instances["private"].post( url, data );
  }

  delete_display_size(id) {
    const data = {
      "id": id
    }

    let url = '/api/displaySize/delete.php';
    return this.instances["private"].post( url, data );
  }

  delete_printed_size(id) {
    const data = {
      "id": id
    }

    let url = '/api/printedSize/delete.php';
    return this.instances["private"].post( url, data );
  }

  delete_image(id) {
    const data = {
      "id": id
    }

    let url = '/api/image/delete.php';
    return this.instances["private"].post( url, data );
  }

  delete_user(id) {
    const data = {
      "id": id
    }

    let url = '/api/user/delete.php';
    return this.instances["private"].post( url, data );
  }
}

export default PHPBackend;

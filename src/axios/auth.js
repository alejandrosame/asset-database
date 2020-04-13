import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1'
});

instance.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params['key'] = 'AIzaSyD78BKOfdLs-CyQuFelO2D3daKBY_wE-II';
    return config;
});

export default instance;

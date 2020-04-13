import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://fir-test-56ad7.firebaseio.com/'
});

export default instance;

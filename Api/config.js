import axios from 'axios';

// const BASE_URL = 'https://wordpress.appcrates.co/inspobin_backend/public/api';
// const IMAGE_BASE_URL = 'https://wordpress.appcrates.co/inspobin_backend/public/';


const _Base = 'https://inspobin.com/';
const BASE_URL = _Base +'api';
const IMAGE_BASE_URL = _Base;
 
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export { BASE_URL, client, IMAGE_BASE_URL };

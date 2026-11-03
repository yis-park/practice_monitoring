import axios from 'axios';
import { API_BASE, IMG_API_BASE, isAssetRequest } from '../config/appConfig';

export const apiInstance = axios.create({
  baseURL: '',
});

apiInstance.interceptors.request.use(
  (config) => {
    const baseURL = isAssetRequest(config.url) ? IMG_API_BASE : API_BASE;
    config.baseURL = baseURL;

    if (isAssetRequest(config.url)) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

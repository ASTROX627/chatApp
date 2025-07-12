import axios from "axios"
import i18next from "i18next";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

export const httpService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

httpService.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = i18next.language;
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
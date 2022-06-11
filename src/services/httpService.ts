import axios, { AxiosRequestConfig } from "axios";
import authService from "./authService";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.headers !== undefined) {
      config.headers["Authorization"] = `Bearer ${authService.getToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      console.log("Unexpected error " + error);
    } else {
      const prevRequest = error?.config;
      if (error.response.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const refreshToken = authService.getRefreshToken();
        if (authService.isTokenExpired(refreshToken)) {
          authService.logout();
          window.location.href = "/login";
        } else {
          authService.refresh();
        }
      }
      return axios.request(prevRequest);
    }

    return Promise.reject(error);
  }
);

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

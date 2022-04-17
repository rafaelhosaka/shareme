import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export function getBaseUrl() {
  return process.env.REACT_APP_API_URL;
}

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("Unexpected error");
  }

  return Promise.reject(error);
});

export function setJwt(jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  getBaseUrl,
  setJwt,
};

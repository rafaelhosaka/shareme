import httpService from "./httpService";
import jwtDecode from "jwt-decode";

const apiEndPoint = "/auth";
const accessToken = "access_token";
const refreshToken = "refresh_token";

httpService.setJwt(getJwt());

export async function login(username, password) {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);
  const { data: jwt } = await httpService.post(apiEndPoint + "/login", form);
  localStorage.setItem(accessToken, jwt.access_token);
  localStorage.setItem(refreshToken, jwt.refresh_token);
}

export function logout() {
  localStorage.removeItem(accessToken);
  localStorage.removeItem(refreshToken);
}

export function getCurrentUser() {
  try {
    return jwtDecode(getJwt());
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(accessToken);
}

export default {
  login,
  logout,
  getCurrentUser,
  getJwt,
};

import ApplicationUserEntity from "../models/applicationUser";
import httpService, { setJwt } from "./httpService";
const jwtDecode = require("jwt-decode");

const apiEndPoint = "/auth";
const accessToken = "access_token";
const refreshToken = "refresh_token";

setJwt(getToken());

export async function login(username: string, password: string) {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);
  const { data: jwt } = await httpService.post(apiEndPoint + "/login", form);
  localStorage.setItem(accessToken, jwt.access_token);
  localStorage.setItem(refreshToken, jwt.refresh_token);
  setJwt(jwt.accessToken);
}

export function logout() {
  localStorage.removeItem(accessToken);
  localStorage.removeItem(refreshToken);
}

export function createUserAccount(user: ApplicationUserEntity) {
  return httpService.post(apiEndPoint + "/user/save", user);
}

export function getCurrentUser() {
  try {
    return jwtDecode(getToken());
  } catch (ex) {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(accessToken);
}

export function getRefreshToken() {
  return localStorage.getItem(refreshToken);
}

export function isTokenExpired(token: string | null) {
  const decodedToken = jwtDecode(token);
  const currentDate = new Date();
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    console.log("Token expired.");
    return true;
  } else {
    console.log("Valid token");
    return false;
  }
}

export async function renewTokens() {
  const { data: jwt } = await httpService.get(apiEndPoint + "/refresh");
  localStorage.setItem(accessToken, jwt.access_token);
  localStorage.setItem(refreshToken, jwt.refresh_token);
  window.location.href = "/home";
}

export default {
  login,
  logout,
  getCurrentUser,
  getToken,
  getRefreshToken,
  isTokenExpired,
  renewTokens,
  createUserAccount,
};

import UserProfileEntity from "./../models/userProfile";
import ApplicationUserEntity from "../models/applicationUser";
import httpService from "./httpService";
import axios from "axios";
const jwtDecode = require("jwt-decode");

const apiEndPoint = "/auth";
const accessToken = "access_token";
const refreshToken = "refresh_token";

export async function login(username: string, password: string) {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);
  const { data } = await httpService.post(apiEndPoint + "/login", form);
  localStorage.setItem(accessToken, data.access_token);
  localStorage.setItem(refreshToken, data.refresh_token);
}

export function logout() {
  localStorage.removeItem(accessToken);
  localStorage.removeItem(refreshToken);
}

export function createUserAccount(
  appUser: ApplicationUserEntity,
  userProfile: UserProfileEntity
) {
  const formData = new FormData();
  formData.append("appUser", JSON.stringify(appUser));
  formData.append("userProfile", JSON.stringify(userProfile));
  return httpService.post(apiEndPoint + "/user/createAccount", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getCurrentUser() {
  try {
    return jwtDecode(getToken());
  } catch (ex) {
    return null;
  }
}

export function getRoles() {
  return getCurrentUser().roles;
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
    return true;
  } else {
    return false;
  }
}

export async function refresh() {
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const { data: jwt } = await axiosInstance.get(apiEndPoint + "/refresh", {
    headers: { Authorization: `Bearer ${getRefreshToken()}` as string },
  });

  localStorage.setItem(accessToken, jwt.access_token);
  localStorage.setItem(refreshToken, jwt.refresh_token);
}

export async function changePasswordByUsername(
  username: string,
  currentPassword: string,
  newPassword: string
) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("currentPassword", currentPassword);
  formData.append("newPassword", newPassword);
  return httpService.put(`${apiEndPoint}/password/username`, formData);
}

export async function changePasswordByToken(
  token: string,
  newPassword: string
) {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("newPassword", newPassword);
  return httpService.put(`${apiEndPoint}/password/token`, formData);
}

export default {
  login,
  logout,
  getCurrentUser,
  getRoles,
  getToken,
  getRefreshToken,
  isTokenExpired,
  refresh,
  createUserAccount,
};

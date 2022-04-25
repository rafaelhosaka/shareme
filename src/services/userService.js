import httpService from "./httpService";
import authService from "./authService";
const apiEndPoint = "/user";

export function getUserByEmail(email) {
  return httpService.get(apiEndPoint + "/" + email);
}

export function saveUser(user) {
  return httpService.post(apiEndPoint + "/", user);
}

export function userImageDownload(userId) {
  return httpService.get(apiEndPoint + "/download/" + userId);
}

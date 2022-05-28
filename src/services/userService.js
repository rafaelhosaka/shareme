import httpService from "./httpService";
const apiEndPoint = "/user";

export function getUserByEmail(email) {
  return httpService.get(apiEndPoint + "/email/" + email);
}

export function getUserById(userId) {
  return httpService.get(apiEndPoint + "/id/" + userId);
}

export function searchUsersContainsName(searchedName) {
  return httpService.get(
    apiEndPoint + "/search/name?query=" + encodeURIComponent(searchedName)
  );
}

export function saveUser(user) {
  return httpService.post(apiEndPoint + "/save", user);
}

export function userImageDownload(userId) {
  return httpService.get(apiEndPoint + "/download/" + userId);
}

export function userImageUpload(formData) {
  return httpService.put(`${apiEndPoint}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

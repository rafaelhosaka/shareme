import httpService from "./httpService";
import UserProfileEntity from "../models/userProfile";

const apiEndPoint = "/user";

export async function getUserByEmail(
  email: string
): Promise<UserProfileEntity> {
  const { data } = await httpService.get(apiEndPoint + "/email/" + email);
  return new UserProfileEntity(data);
}

export async function getUserById(userId: string): Promise<UserProfileEntity> {
  const { data } = await httpService.get(apiEndPoint + "/id/" + userId);
  return new UserProfileEntity(data);
}

export function searchUsersContainsName(searchedName: string) {
  return httpService.get(
    apiEndPoint + "/search/name?query=" + encodeURIComponent(searchedName)
  );
}

export function saveUser(user: UserProfileEntity) {
  return httpService.post(apiEndPoint + "/save", user);
}

export function userImageDownload(userId: string) {
  return httpService.get(apiEndPoint + "/download/" + userId);
}

export async function userImageUpload(
  formData: FormData
): Promise<UserProfileEntity> {
  const { data } = await httpService.put(`${apiEndPoint}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return new UserProfileEntity(data);
}

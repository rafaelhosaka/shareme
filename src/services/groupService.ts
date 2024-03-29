import { CancelToken } from "axios";
import httpService from "./httpService";

const apiEndPoint = "/group";

export function createGroup(groupJson: string, file: File) {
  const formData = new FormData();
  formData.append("group", groupJson);
  formData.append("file", file);
  return httpService.post(`${apiEndPoint}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function getAllGroups() {
  return httpService.get(`${apiEndPoint}/all`);
}

export function getGroupById(groupId: string) {
  return httpService.get(`${apiEndPoint}/${groupId}`);
}

export function getGroupsByUserId(userId: string) {
  return httpService.get(`${apiEndPoint}/user/${userId}`);
}

export function downloadGroupImage(groupId: string, cancelToken?: CancelToken) {
  return httpService.get(`${apiEndPoint}/download/${groupId}`, { cancelToken });
}

export function searchGroupsContainsName(searchedName: string) {
  return httpService.get(
    apiEndPoint + "/search/name?query=" + encodeURIComponent(searchedName)
  );
}

export function groupCoverImageUpload(groupId: string, file: File) {
  const formData = new FormData();
  formData.append("groupId", groupId);
  formData.append("file", file);
  return httpService.put(`${apiEndPoint}/uploadCoverImage`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function joinGroup(groupId: string, userId: string) {
  const formData = new FormData();
  formData.append("groupId", groupId);
  formData.append("userId", userId);
  return httpService.put(`${apiEndPoint}/join`, formData);
}

export function leaveGroup(groupId: string, userId: string) {
  const formData = new FormData();
  formData.append("groupId", groupId);
  formData.append("userId", userId);
  return httpService.put(`${apiEndPoint}/leave`, formData);
}

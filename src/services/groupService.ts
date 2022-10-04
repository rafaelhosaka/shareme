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

export function getGroupsByUserId(userId: string) {
  return httpService.get(`${apiEndPoint}/user/${userId}`);
}

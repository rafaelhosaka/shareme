import httpService from "./httpService";

const apiEndPoint = "/photos";

export function getPhotos() {
  return httpService.get(apiEndPoint);
}

export function getPhotoById(id) {
  return httpService.get(`${apiEndPoint}/${id}`);
}

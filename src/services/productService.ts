import _ from "lodash";
import httpService from "./httpService";

const apiEndPoint = "/product";

export function getAllProducts() {
  return httpService.get(`${apiEndPoint}/all`);
}

export function getProductsByCategory(category: string) {
  return httpService.get(`${apiEndPoint}/${category}`);
}

export function createProduct(formData: FormData) {
  return httpService.post(`${apiEndPoint}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function productImageDownload(productId: string) {
  return httpService.get(apiEndPoint + "/download/" + productId);
}

export function getCategories() {
  return httpService.get(apiEndPoint + "/category");
}

export function getCurrencies() {
  return httpService.get(apiEndPoint + "/currency");
}

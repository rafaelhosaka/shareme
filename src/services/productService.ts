import { CancelToken } from "axios";
import _ from "lodash";
import httpService from "./httpService";

const apiEndPoint = "/product";

export function getAllProducts() {
  return httpService.get(`${apiEndPoint}/all`);
}

export function getProductsByCategory(category: string) {
  return httpService.get(`${apiEndPoint}/${category}`);
}

export function createProduct(productJson: string, file: File) {
  const formData = new FormData();
  formData.append("product", productJson);
  formData.append("file", file);
  return httpService.post(`${apiEndPoint}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function productImageDownload(
  productId: string,
  cancelToken?: CancelToken
) {
  return httpService.get(apiEndPoint + "/download/" + productId, {
    cancelToken,
  });
}

export function getCategories() {
  return httpService.get(apiEndPoint + "/category");
}

export function getCurrencies() {
  return httpService.get(apiEndPoint + "/currency");
}

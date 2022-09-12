import { TFunction } from "i18next";
import UserProfileEntity from "./userProfile";

export interface ProductEntity {
  id: string;
  title: string;
  description: string;
  dateCreated: Date;
  fileName: string;
  category: string;
  currency: string;
  price: number;
  user: UserProfileEntity;
}

export function getTranslatedCategory(category: string, t: TFunction) {
  switch (category) {
    case "vehicle":
      return t("CATEGORY.vehicle");
    case "apparel":
      return t("CATEGORY.apparel");
    case "other":
      return t("CATEGORY.other");
    default:
      return "";
  }
}

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
    case "electronic":
      return t("CATEGORY.electronic");
    case "home_goods":
      return t("CATEGORY.homeGoods");
    case "musical_instrument":
      return t("CATEGORY.musicalInstrument");
    case "game":
      return t("CATEGORY.game");
    case "other":
      return t("CATEGORY.other");
    default:
      return "";
  }
}

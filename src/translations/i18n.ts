import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { TRANSLATIONS_JP } from "./jp/translations";
import { TRANSLATIONS_EN } from "./en/translations";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: TRANSLATIONS_EN,
      },
      jp: {
        translation: TRANSLATIONS_JP,
      },
    },
    fallbackLng: "en",
  });

export function changeLanguage(lang: string) {
  i18n.changeLanguage(lang);
}

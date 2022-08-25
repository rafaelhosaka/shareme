import React, { useContext, useEffect, useState } from "react";
import { getLanguageByShortName, LanguageEntity } from "../models/language";
import { changeLanguage as change } from "../translations/i18n";
import { useUser } from "./userContext";

interface LanguageContextInterface {
  language: LanguageEntity;
  changeLanguage: ((lang: LanguageEntity) => void) | null;
}

const LanguageContext = React.createContext<LanguageContextInterface>({
  language: { shortName: "en", longName: "English" },
  changeLanguage: null,
});

LanguageContext.displayName = "LanguageContext";

export function useLanguage() {
  return useContext(LanguageContext);
}

interface LanguageProviderProps {
  children: JSX.Element;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { user } = useUser();
  const [language, setLanguage] = useState<LanguageEntity>({
    shortName: "en",
    longName: "English",
  });

  useEffect(() => {
    if (user) {
      setLanguage(user.languagePreference);
    } else {
      setLanguage(getLanguageByShortName(navigator.language));
    }
  }, [user]);

  useEffect(() => {
    change(language?.shortName);
  }, [language]);

  const changeLanguage = (lang: LanguageEntity) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

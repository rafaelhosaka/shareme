import { useAlert } from "../../components/Alert/Alert";
import SettingSelectItem from "../../components/SettingItem/SettingLanguageItem";
import { useLanguage } from "../../context/languageContext";
import { useUser } from "../../context/userContext";
import { getLanguageList, LanguageEntity } from "../../models/language";
import { updateUser } from "../../services/userService";
import css from "./GeneralSettings.module.scss";

const LanguageSettings = () => {
  const { user, setUser } = useUser();
  const [alert, dispatchAlert] = useAlert();
  const { changeLanguage } = useLanguage();

  const handleSaveLanguage = (value: LanguageEntity) => {
    if (user && setUser && changeLanguage) {
      user.languagePreference = value;
      updateUser(user);
      setUser(user);
      dispatchAlert("Change saved successfully", "success");
      changeLanguage(value);
    }
  };

  if (user) {
    return (
      <div className={`${css["general-settings__container"]} p2`}>
        {alert}
        <h2>Language Settings</h2>
        <div className={css["setting-list"]}>
          <SettingSelectItem
            label="Language"
            value={user.languagePreference?.shortName}
            items={getLanguageList()}
            onSave={handleSaveLanguage}
          />
        </div>
      </div>
    );
  }

  return <></>;
};

export default LanguageSettings;

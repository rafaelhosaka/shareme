import { useTranslation } from "react-i18next";
import { useAlert } from "../../components/Alert/Alert";
import SettingDateItem from "../../components/SettingItem/SettingDateItem";
import SettingNamesItem from "../../components/SettingItem/SettingNamesItem";
import SettingPasswordItem from "../../components/SettingItem/SettingPasswordItem";
import { useUser } from "../../context/userContext";
import { updateUser } from "../../services/userService";
import css from "./GeneralSettings.module.scss";

const GeneralSettings = () => {
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const [alert, dispatchAlert] = useAlert();

  const handleSaveName = (firstValue: string, secondValue: string) => {
    if (user && setUser) {
      user.firstName = firstValue;
      user.lastName = secondValue;
      updateUser(user);
      setUser(user);
      dispatchAlert(t("SETTINGS.alertChangeSaved"), "success");
    }
  };

  const handleSaveBirthDate = (value: Date) => {
    if (user && setUser) {
      user.birthDate = value;
      updateUser(user);
      setUser(user);
      dispatchAlert(t("SETTINGS.alertChangeSaved"), "success");
    }
  };

  if (user) {
    return (
      <div className={`${css["general-settings__container"]}`}>
        {alert}
        <h2 className="p2">{t("SETTINGS.generalSettingHeader")}</h2>
        <div className={css["setting-list"]}>
          <SettingNamesItem
            label={t("SETTINGS.name")}
            firstNameParam={user.firstName}
            lastNameParam={user.lastName}
            onSave={handleSaveName}
          />
          <SettingDateItem
            label={t("SETTINGS.birthday")}
            value={user.birthDate}
            onSave={handleSaveBirthDate}
          />
          <SettingPasswordItem
            label={t("SETTINGS.password")}
            username={user.email}
          />
        </div>
      </div>
    );
  }

  return <></>;
};

export default GeneralSettings;

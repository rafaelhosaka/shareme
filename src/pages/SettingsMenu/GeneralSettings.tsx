import { useTranslation } from "react-i18next";
import { useAlert } from "../../components/Alert/Alert";
import SettingDateItem from "../../components/SettingItem/SettingDateItem";
import SettingItem from "../../components/SettingItem/SettingItem";
import SettingPasswordItem from "../../components/SettingItem/SettingPasswordItem";
import { useUser } from "../../context/userContext";
import { updateUser } from "../../services/userService";
import css from "./GeneralSettings.module.scss";

const GeneralSettings = () => {
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const [alert, dispatchAlert] = useAlert();

  const handleSaveName = (values: string[]) => {
    if (user && setUser) {
      user.firstName = values[0];
      user.lastName = values[1];
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
      <div className={`${css["general-settings__container"]} p2`}>
        {alert}
        <h2>{t("SETTINGS.generalSettingHeader")}</h2>
        <div className={css["setting-list"]}>
          <SettingItem
            label={t("SETTINGS.name")}
            value={[user.firstName, user.lastName]}
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

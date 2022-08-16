import { useAlert } from "../../components/Alert/Alert";
import SettingItem from "../../components/SettingItem/SettingItem";
import SettingPasswordItem from "../../components/SettingItem/SettingPasswordItem";
import { useUser } from "../../context/userContext";
import { updateUser } from "../../services/userService";
import css from "./GeneralSettings.module.scss";

const GeneralSettings = () => {
  const { user, setUser } = useUser();
  const [alert, dispatchAlert] = useAlert();

  const handleSaveName = (values: string[]) => {
    if (user && setUser) {
      user.firstName = values[0];
      user.lastName = values[1];
      updateUser(user);
      setUser(user);
      dispatchAlert("Change saved successfully", "success");
    }
  };

  if (user) {
    return (
      <div className={`${css["general-settings__container"]} p2`}>
        {alert}
        <h2>General Account Settings</h2>
        <div className={css["setting-list"]}>
          <SettingItem
            label="Name"
            value={[user.firstName, user.lastName]}
            onSave={handleSaveName}
          />
          <SettingPasswordItem label="Password" username={user.email} />
        </div>
      </div>
    );
  }

  return <></>;
};

export default GeneralSettings;

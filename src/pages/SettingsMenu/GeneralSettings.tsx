import { useState } from "react";
import { useAlert } from "../../components/Alert/Alert";
import { useUser } from "../../context/userContext";
import { useEditableText } from "../../hook/useEditableText";
import { updateUser } from "../../services/userService";
import css from "./GeneralSettings.module.scss";

const GeneralSettings = () => {
  const { user, setUser } = useUser();
  const [alert, dispatchAlert] = useAlert();

  const [editableFirstName, firstName, resetFirstName] = useEditableText(
    user?.firstName ?? ""
  );
  const [editableLastName, lastName, resetLastName] = useEditableText(
    user?.lastName ?? ""
  );
  const [editting, setEditting] = useState(false);

  const handleSave = () => {
    if (user && setUser) {
      updateUser(user);
      setUser(user);
      setEditting(false);
      dispatchAlert("Change saved successfully", "success");
    }
  };

  const handleCancel = () => {
    resetFirstName();
    resetLastName();
    setEditting(false);
  };

  if (user) {
    return (
      <div className={`${css["general-settings__container"]} p2`}>
        {alert}
        <h2>General Account Settings</h2>
        <div className={css["setting-list"]}>
          <div className={css["setting-item"]}>
            <strong>Name</strong>
            <div className={css["name"]}>
              {editableFirstName(editting)}
              {editableLastName(editting)}
            </div>
            <div className={css["btn-area"]}>
              {editting ? (
                <>
                  <button
                    onClick={() => {
                      user.firstName = firstName;
                      user.lastName = lastName;
                      handleSave();
                    }}
                    className="btn btn--primary"
                  >
                    Save
                  </button>
                  <button onClick={handleCancel} className="btn btn--secondary">
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditting(true)}
                  className="btn btn--primary"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default GeneralSettings;

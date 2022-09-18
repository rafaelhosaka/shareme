import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/languageContext";
import { useEditableText } from "../../hook/useEditableText";
import css from "./SettingItem.module.scss";

interface SettingNamesItemProps {
  label: string;
  firstNameParam: string;
  lastNameParam: string;
  onSave: (firstName: string, lastName: string) => void;
  placeHolder?: string;
}

const SettingNamesItem = ({
  label,
  firstNameParam,
  lastNameParam,
  onSave,
  placeHolder,
}: SettingNamesItemProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [editableFirstName, firstName, resetFirstName] =
    useEditableText(firstNameParam);
  const [editableLastName, lastName, resetLastName] =
    useEditableText(lastNameParam);

  const [editting, setEditting] = useState(false);

  const handleCancel = () => {
    resetFirstName();
    resetLastName();
    setEditting(false);
  };

  const getFirstNameField = () => {
    return (
      <div className={css["name"]}>
        {editting && <span>{t("SETTINGS.first")}</span>}
        {editableFirstName(editting, placeHolder)}
      </div>
    );
  };

  const getLastNameField = () => {
    return (
      <div className={css["name"]}>
        {editting && <span>{t("SETTINGS.last")}</span>}
        {editableLastName(editting, placeHolder)}
      </div>
    );
  };

  const renderFirstNameLastName = () => {
    return (
      <>
        {getFirstNameField()}
        {getLastNameField()}
      </>
    );
  };

  const renderLastNameFirstName = () => {
    return (
      <>
        {getLastNameField()}
        {getFirstNameField()}
      </>
    );
  };

  const renderNamesField = () => {
    if (language) {
      switch (language.shortName) {
        case "ja":
          return renderLastNameFirstName();
        default:
          return renderFirstNameLastName();
      }
    } else {
      return renderFirstNameLastName();
    }
  };

  return (
    <div className={css["setting-item"]}>
      <strong>{label}</strong>
      <div className={editting ? css["field-names"] : css["field"]}>
        {renderNamesField()}
      </div>
      <div className={css["btn-area"]}>
        {editting ? (
          <>
            <button
              onClick={() => {
                setEditting(false);
                onSave(firstName, lastName);
              }}
              className="btn btn--primary"
            >
              {t("SETTINGS.save")}
            </button>
            <button onClick={handleCancel} className="btn btn--secondary">
              {t("SETTINGS.cancel")}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditting(true)}
            className="btn btn--primary"
          >
            {t("SETTINGS.edit")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingNamesItem;

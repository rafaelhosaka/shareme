import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEditableText } from "../../hook/useEditableText";
import css from "./SettingItem.module.scss";

interface SettingItemProps {
  label: string;
  value: string | [string, string];
  onSave: (value: string[]) => void;
  placeHolder?: string;
}

const SettingItem = ({
  label,
  value,
  onSave,
  placeHolder,
}: SettingItemProps) => {
  const { t } = useTranslation();
  const [editableMainField, mainField, resetMainField] = useEditableText(
    Array.isArray(value) ? value[0] : value
  );
  const [editableSecondaryField, secondaryField, resetSecondaryField] =
    useEditableText(Array.isArray(value) ? value[1] : null);

  const [editting, setEditting] = useState(false);

  const handleCancel = () => {
    resetMainField();
    resetSecondaryField();
    setEditting(false);
  };

  return (
    <div className={css["setting-item"]}>
      <strong>{label}</strong>
      <div className={css["field"]}>
        <div>{editableMainField(editting, placeHolder)}</div>
        {secondaryField && (
          <div>{editableSecondaryField(editting, placeHolder)}</div>
        )}
      </div>
      <div className={css["btn-area"]}>
        {editting ? (
          <>
            <button
              onClick={() => {
                setEditting(false);
                onSave([mainField, secondaryField]);
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

export default SettingItem;

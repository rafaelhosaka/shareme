import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEditableDate } from "../../hook/useEditableDate";
import css from "./SettingItem.module.scss";

interface SettingDateItemProps {
  label: string;
  value: Date;
  onSave: (value: Date) => void;
}

const SettingDateItem = ({ label, value, onSave }: SettingDateItemProps) => {
  const { t } = useTranslation();
  const [editableDate, date, resetDate] = useEditableDate(value);

  const [editting, setEditting] = useState(false);

  const handleCancel = () => {
    resetDate();
    setEditting(false);
  };

  return (
    <div className={css["setting-item"]}>
      <strong>{label}</strong>
      <div className={css["field"]}>
        <div>{editableDate(editting)}</div>
      </div>
      <div className={css["btn-area"]}>
        {editting ? (
          <>
            <button
              onClick={() => {
                setEditting(false);
                onSave(date);
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

export default SettingDateItem;

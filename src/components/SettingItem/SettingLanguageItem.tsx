import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageEntity } from "../../models/language";
import css from "./SettingItem.module.scss";

interface SettingLanguageItemProps {
  label: string;
  value: string;
  items: LanguageEntity[];
  onSave: (value: LanguageEntity) => void;
  placeHolder?: string;
}

const SettingLanguageItem = ({
  label,
  value,
  items,
  onSave,
}: SettingLanguageItemProps) => {
  const { t } = useTranslation();
  const [editting, setEditting] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleCancel = () => {
    setEditting(false);
    setSelectedValue(value);
  };

  return (
    <div className={css["setting-item"]}>
      <strong>{label}</strong>
      <div className={css["field-select"]}>
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.currentTarget.value)}
          disabled={!editting}
          className={editting ? css["select-editting"] : css["select"]}
        >
          {items.map((item) => (
            <option key={item.shortName} value={item.shortName}>
              {item.longName}
            </option>
          ))}
        </select>
      </div>
      <div className={css["btn-area"]}>
        {editting ? (
          <>
            <button
              onClick={() => {
                setEditting(false);
                onSave(
                  items.filter((item) => item.shortName === selectedValue)[0]
                );
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

export default SettingLanguageItem;

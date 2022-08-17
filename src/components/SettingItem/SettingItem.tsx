import { useState } from "react";
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
  );
};

export default SettingItem;

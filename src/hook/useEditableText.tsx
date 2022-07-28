import React, { useEffect, useRef, useState } from "react";
import css from "./styles/useEditable.module.scss";

export function useEditableText(
  value: string | null
): [
  (editable: boolean, placeHolder?: string) => JSX.Element,
  string,
  () => void
] {
  const [text, setText] = useState(value ? value : "");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (value && ref.current?.innerText != undefined) {
      ref.current.innerText = value;
    }
  }, []);

  const reset = () => {
    setText(value ? value : "");
    if (value && ref.current?.innerText != undefined) {
      ref.current.innerText = value;
    }
  };

  const handleChange = (e: React.FormEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setText(e.currentTarget.innerText);
  };

  const renderEditableField = (editable: boolean, placeHolder?: string) => {
    return (
      <div className={css["editable-text__container"]}>
        <span
          ref={ref}
          data-placeholder={placeHolder ?? ""}
          suppressContentEditableWarning
          onInput={handleChange}
          className={editable ? css["editable"] : "uneditable"}
          contentEditable={editable}
        ></span>
      </div>
    );
  };

  return [renderEditableField, text, reset];
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/languageContext";
import { formatDate } from "../utils/formatDate";
import css from "./styles/useEditable.module.scss";

export function useEditableDate(
  value: Date | null
): [(editable: boolean) => JSX.Element, Date, () => void] {
  const { t } = useTranslation();
  const [date, setDate] = useState(value ? new Date(value) : new Date());
  const { language } = useLanguage();

  const MONTHS = [
    t("REGISTER_FORM.jan"),
    t("REGISTER_FORM.feb"),
    t("REGISTER_FORM.mar"),
    t("REGISTER_FORM.apr"),
    t("REGISTER_FORM.may"),
    t("REGISTER_FORM.jun"),
    t("REGISTER_FORM.jul"),
    t("REGISTER_FORM.aug"),
    t("REGISTER_FORM.sep"),
    t("REGISTER_FORM.oct"),
    t("REGISTER_FORM.nov"),
    t("REGISTER_FORM.dec"),
  ];

  const DAYS = [...Array(31).keys()].map((index) => {
    index++;
    return index.toString();
  });

  const currentYear = new Date().getFullYear();

  const YEARS = [...Array(100).keys()].map((index) => {
    return (currentYear - index).toString();
  });

  const reset = () => {
    setDate(value ? new Date(value) : new Date());
  };

  const getDayField = () => {
    return (
      <select
        value={date.getDate()}
        onChange={(e) =>
          setDate(new Date(date.setDate(parseInt(e.currentTarget.value))))
        }
        className={css["editable"]}
      >
        {DAYS.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    );
  };

  const getMonthField = () => {
    return (
      <select
        value={date.getMonth()}
        onChange={(e) =>
          setDate(new Date(date.setMonth(parseInt(e.currentTarget.value))))
        }
        className={css["editable"]}
      >
        {MONTHS.map((month, index) => (
          <option key={month} value={index}>
            {month}
          </option>
        ))}
      </select>
    );
  };

  const getYearField = () => {
    return (
      <select
        value={date.getFullYear()}
        onChange={(e) =>
          setDate(new Date(date.setFullYear(parseInt(e.currentTarget.value))))
        }
        className={css["editable"]}
      >
        {YEARS.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>
    );
  };

  const yearMonthDayFormatField = () => {
    return (
      <>
        <div className={css["editable-text__container"]}>
          {getYearField()}
          {getMonthField()}
          {getDayField()}
        </div>
      </>
    );
  };

  const monthDayYearFormatField = () => {
    return (
      <>
        <div className={css["editable-text__container"]}>
          {getMonthField()}
          {getDayField()}
          {getYearField()}
        </div>
      </>
    );
  };

  const getDateFields = () => {
    if (language) {
      switch (language.shortName) {
        case "ja":
          return yearMonthDayFormatField();
        default:
          return monthDayYearFormatField();
      }
    } else {
      return monthDayYearFormatField();
    }
  };

  const renderEditableField = (editable: boolean) => {
    return (
      <>
        {editable ? (
          getDateFields()
        ) : (
          <span>
            {formatDate(date, t("DATE.bcp47"), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </>
    );
  };

  return [renderEditableField, date, reset];
}

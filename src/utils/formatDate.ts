import { TFunction } from "i18next";

const defaultOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
} as Intl.DateTimeFormatOptions;

//for now it's not flexible
export function formatDate(
  date: Date | string,
  locale: string,
  format?: Intl.DateTimeFormatOptions
) {
  const d = new Date(date);
  if (format) {
    return d.toLocaleDateString(locale, format);
  }
  return d.toLocaleDateString(locale, defaultOptions);
}

//return the higher unit from minute to days
//the minimum is 1 minute
export function pastTimeFromDate(date: Date | string, t: TFunction) {
  const suffix = {
    year: t("DATE.suffixYear"),
    week: t("DATE.suffixWeek"),
    day: t("DATE.suffixDay"),
    hour: t("DATE.suffixHour"),
    minute: t("DATE.suffixMinute"),
  };
  const datePast = new Date(date);
  const dateNow = new Date();
  const diffMinutes = Math.floor(
    Math.abs(dateNow.getTime() - datePast.getTime()) / (1000 * 60)
  );
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return diffYears + suffix.year;
  }

  if (diffWeeks > 0) {
    return diffWeeks + suffix.week;
  }

  if (diffDays > 0) {
    return diffDays + suffix.day;
  }

  if (diffHours > 0) {
    return diffHours + suffix.hour;
  }

  if (diffMinutes > 0) {
    return diffMinutes + suffix.minute;
  }

  return "1" + suffix.minute;
}

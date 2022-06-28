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
  format?: Intl.DateTimeFormatOptions
) {
  const d = new Date(date);
  if (format) {
    return d.toLocaleDateString("en-US", format);
  }
  return d.toLocaleDateString("en-US", defaultOptions);
}

//return the higher unit from minute to days
//the minimum is 1 minute
export function pastTimeFromDate(date: Date | string) {
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
    return diffYears + "y";
  }

  if (diffWeeks > 0) {
    return diffWeeks + "w";
  }

  if (diffDays > 0) {
    return diffDays + "d";
  }

  if (diffHours > 0) {
    return diffHours + "h";
  }

  if (diffMinutes > 0) {
    return diffMinutes + "m";
  }

  return "1m";
}

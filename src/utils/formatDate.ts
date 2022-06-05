//for now it's not flexible
export function formatDate(date: Date | string) {
  const d = new Date(date);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;
  return d.toLocaleDateString("en-US", options);
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

//for now it's not flexible
export function formatDate(date) {
  const d = new Date(date);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return d.toLocaleDateString("en-US", options);
}

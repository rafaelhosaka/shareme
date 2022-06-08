import _ from "lodash";

export function paginate<T>(
  items: T[],
  pageNumber: number,
  pageSize: number
): T[] {
  const startIndex = (pageNumber - 1) * pageSize;
  return _(items).slice(startIndex).take(pageSize).value();
}

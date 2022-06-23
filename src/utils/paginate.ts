import _ from "lodash";

export function paginate<T>(
  items: T[],
  pageNumber: number,
  pageSize: number
): T[] {
  const startIndex = (pageNumber - 1) * pageSize;
  return _(items).slice(startIndex).take(pageSize).value();
}

export function calculateMaxPage(totalCount: number, pageSize: number) {
  let maxPage = totalCount / pageSize;
  if (totalCount % pageSize >= 1) {
    maxPage++;
  }
  return Math.floor(maxPage);
}

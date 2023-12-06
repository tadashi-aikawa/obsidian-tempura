export function sorter<T, U extends number | string>(
  toOrdered: (t: T) => U,
  order: "asc" | "desc" = "asc"
) {
  return (a: T, b: T) =>
    order === "asc"
      ? toOrdered(a) > toOrdered(b)
        ? 1
        : toOrdered(b) > toOrdered(a)
        ? -1
        : 0
      : toOrdered(a) < toOrdered(b)
      ? 1
      : toOrdered(b) < toOrdered(a)
      ? -1
      : 0;
}

export function orderBy<T, U extends number | string>(
  collections: T[],
  predicate: (t: T) => U,
  order: "asc" | "desc" = "asc"
): T[] {
  return collections.slice().sort(sorter(predicate, order));
}

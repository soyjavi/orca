export const sortBy = (a, b, { field, asc = true } = {}) => {
  if (!field) return 0;

  if (a[field] < b[field]) return asc ? -1 : 1;
  if (a[field] > b[field]) return asc ? 1 : -1;
  return 0;
};

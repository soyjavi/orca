export const activePositions = (positions = []) =>
  positions.filter(({ size = 0 }) => size > 0);

export function getGridColumns(
  width: number,
  breakpoints: Record<number, number>,
): number {
  if (!width) {
    return 0;
  }

  let result = 0; // default columns

  // Iterate sorted breakpoints
  for (const bp of Object.keys(breakpoints)
    .map(Number)
    .sort((a, b) => a - b)) {
    if (width >= bp) {
      result = breakpoints[bp];
    }
  }

  return result;
}

export function isDimensionValid(dimension: { width: number; height: number }) {
  return dimension.width > 0 && dimension.height > 0;
}

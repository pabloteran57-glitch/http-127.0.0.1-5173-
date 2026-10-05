export function formatNumber(value: number, fractionDigits?: number) {
  return new Intl.NumberFormat("es", {
    minimumFractionDigits: fractionDigits ?? 0,
    maximumFractionDigits: fractionDigits ?? 3,
  }).format(value);
}

export function formatWeight(value: number | null) {
  if (value === null) {
    return "No publicado";
  }

  return `${formatNumber(value)} g`;
}

export function formatDimensions(
  length: number | null,
  width: number | null,
  height: number | null,
) {
  const values = [length, width, height].filter(
    (entry): entry is number => entry !== null,
  );

  if (!values.length) {
    return "No publicado";
  }

  return [length, width, height]
    .map((entry) => (entry === null ? "?" : formatNumber(entry)))
    .join(" × ") + " mm";
}

export function titleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}


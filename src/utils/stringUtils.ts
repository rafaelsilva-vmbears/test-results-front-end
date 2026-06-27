export function truncateString(
  str: string | null | undefined,
  maxLength: number
): string {
  if (!str || maxLength <= 0) {
    return str || "";
  }

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3) + "...";
}

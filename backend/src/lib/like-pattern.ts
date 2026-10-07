/** A LIKE/ILIKE pattern that matches `text` anywhere, with its wildcards treated literally. */
export function containsPattern(text: string): string {
  return `%${text.replace(/[\\%_]/g, "\\$&")}%`;
}

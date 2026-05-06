export interface Taggable {
  tags?: string[];
}

/**
 * If `selectedTags` is empty, returns `items` unchanged.
 * Otherwise keeps only items that match at least one selected tag,
 * sorted by descending match count.
 */
export function filterAndSortByTags<T extends Taggable>(
  items: T[],
  selectedTags: string[],
): T[] {
  if (selectedTags.length === 0) {
    return items;
  }

  return items
    .map((item) => ({
      item,
      matches: (item.tags ?? []).filter((t) => selectedTags.includes(t)).length,
    }))
    .filter(({ matches }) => matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .map(({ item }) => item);
}

export function uniqueTags<T extends Taggable>(items: T[]): string[] {
  return Array.from(new Set(items.flatMap((i) => i.tags ?? []))).sort();
}

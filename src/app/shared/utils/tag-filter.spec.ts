import { filterAndSortByTags, uniqueTags } from './tag-filter';

interface Item {
  id: string;
  tags?: string[];
}

const items: Item[] = [
  { id: 'a', tags: ['x'] },
  { id: 'b', tags: ['x', 'y'] },
  { id: 'c', tags: ['y', 'z'] },
  { id: 'd', tags: ['x', 'y', 'z'] },
  { id: 'e' },
];

describe('filterAndSortByTags', () => {
  it('returns all items when no tags are selected', () => {
    expect(filterAndSortByTags(items, [])).toEqual(items);
  });

  it('filters out items that match none of the selected tags', () => {
    const result = filterAndSortByTags(items, ['x']);
    expect(result.map((i) => i.id)).toEqual(
      jasmine.arrayContaining(['a', 'b', 'd']),
    );
    expect(result.find((i) => i.id === 'c')).toBeUndefined();
    expect(result.find((i) => i.id === 'e')).toBeUndefined();
  });

  it('sorts by descending match count', () => {
    const result = filterAndSortByTags(items, ['x', 'y']);
    const matchCounts = result.map(
      (i) => (i.tags ?? []).filter((t) => ['x', 'y'].includes(t)).length,
    );
    expect(matchCounts).toEqual([...matchCounts].sort((a, b) => b - a));
    expect(matchCounts[0]).toBe(2);
  });

  it('handles items without tags safely', () => {
    expect(() => filterAndSortByTags(items, ['x'])).not.toThrow();
  });
});

describe('uniqueTags', () => {
  it('returns sorted unique tags from all items', () => {
    expect(uniqueTags(items)).toEqual(['x', 'y', 'z']);
  });

  it('returns empty array when no items have tags', () => {
    expect(uniqueTags([{}])).toEqual([]);
  });
});

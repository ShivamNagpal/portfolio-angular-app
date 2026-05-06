import { estimateReadingMinutes } from './reading-time';

describe('estimateReadingMinutes', () => {
  it('returns 1 for empty input', () => {
    expect(estimateReadingMinutes('')).toBe(1);
  });

  it('returns 1 for short text', () => {
    expect(estimateReadingMinutes('hello world')).toBe(1);
  });

  it('returns 1 for exactly 200 words', () => {
    const text = Array(200).fill('word').join(' ');
    expect(estimateReadingMinutes(text)).toBe(1);
  });

  it('rounds up to next minute past 200 words', () => {
    const text = Array(201).fill('word').join(' ');
    expect(estimateReadingMinutes(text)).toBe(2);
  });

  it('strips Markdown punctuation safely', () => {
    const text = '# Heading\n\n- item one\n- item two\n\n`inline code`';
    expect(() => estimateReadingMinutes(text)).not.toThrow();
    expect(estimateReadingMinutes(text)).toBe(1);
  });

  it('ignores fenced code blocks for word counting', () => {
    const lots = Array(500).fill('console.log("x");').join('\n');
    const text = '# Title\n\n```\n' + lots + '\n```\n';
    expect(estimateReadingMinutes(text)).toBe(1);
  });
});

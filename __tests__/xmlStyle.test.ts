import { getStyle } from '../src/xml';

describe('getStyle', () => {
  test('preserves colons in declaration values', () => {
    expect(
      getStyle('filter: url(https://example.com/filter.svg#blur); fill: red')
    ).toEqual({
      filter: 'url(https://example.com/filter.svg#blur)',
      fill: 'red',
    });
  });

  test('preserves semicolons in quoted and function values', () => {
    expect(
      getStyle(
        'font-family: "A; B"; filter: url(data:image/svg+xml;utf8,<svg/>); fill: red'
      )
    ).toEqual({
      fontFamily: '"A; B"',
      filter: 'url(data:image/svg+xml;utf8,<svg/>)',
      fill: 'red',
    });
  });

  test('ignores malformed declarations', () => {
    expect(getStyle('fill: red; malformed; stroke: blue')).toEqual({
      fill: 'red',
      stroke: 'blue',
    });
  });
});

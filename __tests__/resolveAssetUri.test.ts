import { resolveAssetUri } from '../src/lib/resolveAssetUri';

const markup = '<svg width="50%"><path fill="#fff" /></svg>';
const encodedMarkup = encodeURIComponent(markup);

describe('resolveAssetUri', () => {
  test.each([
    ['unencoded', markup],
    ['already encoded', encodedMarkup],
  ])('normalizes %s SVG data URI markup once', (_label, svg) => {
    expect(resolveAssetUri(`data:image/svg+xml;utf8,${svg}`)?.uri).toBe(
      `data:image/svg+xml;utf8,${encodedMarkup}`
    );
  });

  test('preserves percent escapes inside raw SVG markup', () => {
    const rawMarkup = '  <svg><image href="file%20name.png" /></svg>';
    const uri = resolveAssetUri(`data:image/svg+xml;utf8,${rawMarkup}`)?.uri;

    expect(uri).toBe(
      `data:image/svg+xml;utf8,${encodeURIComponent(rawMarkup)}`
    );
    expect(uri).toContain('file%2520name.png');
    expect(decodeURIComponent(uri!)).toContain('file%20name.png');
  });
});

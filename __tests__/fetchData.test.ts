import { fetchText } from '../src/utils/fetchData';

const toBase64Uri = (xml: string) =>
  `data:image/svg+xml;base64,${Buffer.from(xml, 'utf-8').toString('base64')}`;

describe('fetchText', () => {
  it('decodes an ASCII base64 data URI', async () => {
    const xml = '<svg><text>Hello</text></svg>';
    expect(await fetchText(toBase64Uri(xml))).toBe(xml);
  });

  it('decodes a base64 data URI as UTF-8', async () => {
    const xml = '<svg><text>Café © 日本 😀</text></svg>';
    expect(await fetchText(toBase64Uri(xml))).toBe(xml);
  });
});

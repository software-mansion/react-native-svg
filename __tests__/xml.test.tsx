import { decodeXmlEntities, parse } from '../src/xml';

describe('decodeXmlEntities', () => {
  it('passes through strings with no entity references', () => {
    expect(decodeXmlEntities('M62.288,89.305 c1.367,0')).toBe('M62.288,89.305 c1.367,0');
    expect(decodeXmlEntities('')).toBe('');
  });

  it('decodes the five standard XML named entities', () => {
    expect(decodeXmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry');
    expect(decodeXmlEntities('1 &lt; 2 &gt; 0')).toBe('1 < 2 > 0');
    expect(decodeXmlEntities('say &quot;hi&quot;')).toBe('say "hi"');
    expect(decodeXmlEntities("it&apos;s")).toBe("it's");
  });

  it('decodes decimal numeric character references', () => {
    expect(decodeXmlEntities('a&#10;b')).toBe('a\nb');
    expect(decodeXmlEntities('a&#9;b')).toBe('a\tb');
    expect(decodeXmlEntities('&#65;&#66;&#67;')).toBe('ABC');
  });

  it('decodes hex numeric character references', () => {
    expect(decodeXmlEntities('&#xA;')).toBe('\n');
    expect(decodeXmlEntities('&#xD;&#xA;')).toBe('\r\n');
    expect(decodeXmlEntities('&#x41;&#x42;')).toBe('AB');
    expect(decodeXmlEntities('&#X41;')).toBe('A');
  });

  it('decodes characters above U+FFFF (4-byte code points)', () => {
    expect(decodeXmlEntities('&#x1F600;')).toBe('\u{1F600}');
  });

  it('leaves unknown / malformed references intact rather than dropping them', () => {
    // Unknown named entity (HTML-only) should be preserved verbatim.
    expect(decodeXmlEntities('a &nbsp; b')).toBe('a &nbsp; b');
    // Malformed numeric references should be preserved.
    expect(decodeXmlEntities('a &# b')).toBe('a &# b');
    expect(decodeXmlEntities('a &amp b')).toBe('a &amp b');
    // Out-of-range code point preserved.
    expect(decodeXmlEntities('&#x110000;')).toBe('&#x110000;');
  });

  it('handles many references in one string (regression for path d attributes)', () => {
    // Real-world shape: SVG path data with embedded CR LF tabs, as produced
    // by some SVG export tools and seen in issue #2877.
    const input =
      'M62.288,89.305c1.367,0,2.741-0.465,3.867-1.415c2.532-2.138,2.853-5.924,0.715-8.455&#xD;&#xA;\t\tC60.642,72.058,57.213,62.67,57.213,53';
    const expected =
      'M62.288,89.305c1.367,0,2.741-0.465,3.867-1.415c2.532-2.138,2.853-5.924,0.715-8.455\r\n\t\tC60.642,72.058,57.213,62.67,57.213,53';
    expect(decodeXmlEntities(input)).toBe(expected);
  });
});

describe('parse() — attribute value decoding', () => {
  it('decodes character references inside attribute values', () => {
    // The repro from issue #2877: SVG with &#xD;&#xA; embedded in the path d.
    // Before the fix, this got passed through to the native renderer which
    // threw an UnexpectedData error that escaped React error boundaries.
    const xml =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">' +
      '<path d="M0,0&#xD;&#xA;L10,10" fill="none"/>' +
      '</svg>';
    const ast = parse(xml);
    expect(ast).not.toBeNull();
    // The `d` attribute should contain a real CR LF, not the entity refs.
    const pathChild = ast?.children[0] as { props: { d: string } } | undefined;
    expect(pathChild?.props.d).toBe('M0,0\r\nL10,10');
    expect(pathChild?.props.d).not.toContain('&#');
  });

  it('decodes the five named entities inside attribute values', () => {
    const xml =
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<text title="&amp; &lt; &gt; &quot; &apos;">hi</text>' +
      '</svg>';
    const ast = parse(xml);
    const text = ast?.children[0] as { props: { title: string } } | undefined;
    expect(text?.props.title).toBe('& < > " \'');
  });

  it('leaves unknown entities intact rather than dropping them', () => {
    const xml =
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<text title="&nbsp;">hi</text>' +
      '</svg>';
    const ast = parse(xml);
    const text = ast?.children[0] as { props: { title: string } } | undefined;
    expect(text?.props.title).toBe('&nbsp;');
  });
});

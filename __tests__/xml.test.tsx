import * as React from 'react';
import { parse } from '../src/ReactNativeSVG';

const textChildren = (svg: string): (React.ReactElement | string)[] => {
  const ast = parse(svg);
  const element = ast?.children[0] as React.ReactElement<{
    children: (React.ReactElement | string)[];
  }>;
  return element.props.children;
};

test('decodes named entities in text nodes', () => {
  expect(
    textChildren(
      '<svg><text x="10" y="32" fontSize="32">&amp; &lt; &gt;</text></svg>'
    )
  ).toEqual(['& < >']);
});

test('decodes quot and apos entities in text nodes', () => {
  expect(textChildren('<svg><text>&quot;a&apos;</text></svg>')).toEqual([
    '"a\'',
  ]);
});

test('decodes decimal and hex numeric character references', () => {
  expect(textChildren('<svg><text>&#65;&#x42;&#X43;</text></svg>')).toEqual([
    'ABC',
  ]);
});

test('decodes numeric references outside the BMP', () => {
  expect(textChildren('<svg><text>&#x1F600;</text></svg>')).toEqual([
    '\u{1F600}',
  ]);
});

test('leaves unknown entities and bare ampersands intact', () => {
  expect(textChildren('<svg><text>&nbsp; &madeup; R&D</text></svg>')).toEqual([
    '&nbsp; &madeup; R&D',
  ]);
});

test('leaves CDATA sections undecoded', () => {
  expect(
    textChildren('<svg><text><![CDATA[&amp; &lt;]]></text></svg>')
  ).toEqual(['&amp; &lt;']);
});

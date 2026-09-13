import * as React from 'react';
import renderer from 'react-test-renderer';
import Svg, { G, Text } from '../src';

/* eslint-disable @typescript-eslint/no-explicit-any */

// `Svg` always renders a single root `RNSVGGroup` that carries the properties
// inherited by the whole drawing.
const rootGroup = (element: React.ReactElement) => {
  const tree = renderer.create(element).toJSON() as any;
  return tree.children[0];
};

test('inherits individual font props set on Svg', () => {
  expect(
    rootGroup(
      <Svg fontSize={30} fontFamily="Menlo" fontWeight="bold">
        <Text>Hi</Text>
      </Svg>
    ).props.font
  ).toEqual({ fontSize: 30, fontFamily: 'Menlo', fontWeight: 'bold' });
});

test('inherits text layout props set on Svg', () => {
  expect(
    rootGroup(
      <Svg textAnchor="middle" letterSpacing={2} wordSpacing={4}>
        <Text>Hi</Text>
      </Svg>
    ).props.font
  ).toEqual({ textAnchor: 'middle', letterSpacing: 2, wordSpacing: 4 });
});

test('resolves the same font as G does for the same props', () => {
  const svgFont = rootGroup(
    <Svg fontSize={30} fontFamily="Menlo" textAnchor="middle">
      <Text>Hi</Text>
    </Svg>
  ).props.font;
  const groupFont = rootGroup(
    <Svg>
      <G fontSize={30} fontFamily="Menlo" textAnchor="middle">
        <Text>Hi</Text>
      </G>
    </Svg>
  ).children[0].props.font;

  expect(svgFont).toEqual(groupFont);
});

test('keeps the font shorthand working', () => {
  expect(
    rootGroup(
      <Svg font={{ fontSize: 30, fontFamily: 'Menlo' }}>
        <Text>Hi</Text>
      </Svg>
    ).props.font
  ).toEqual({ fontSize: 30, fontFamily: 'Menlo' });
});

test('lets an individual font prop win over the font shorthand', () => {
  expect(
    rootGroup(
      <Svg font={{ fontSize: 30, fontFamily: 'Menlo' }} fontSize={12}>
        <Text>Hi</Text>
      </Svg>
    ).props.font
  ).toEqual({ fontSize: 12, fontFamily: 'Menlo' });
});

test('sets no font when Svg has no font props', () => {
  expect(
    rootGroup(
      <Svg>
        <Text>Hi</Text>
      </Svg>
    ).props
  ).not.toHaveProperty('font');
});

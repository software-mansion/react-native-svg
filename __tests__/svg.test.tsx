import * as React from 'react';
import renderer from 'react-test-renderer';
import { Rect, Svg } from '../src/ReactNativeSVG';

test('applies x and y as a native view translation', () => {
  const tree = renderer
    .create(
      <Svg x={20} y={30} width={100} height={100}>
        <Rect width={10} height={10} />
      </Svg>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

test('keeps existing transforms when applying x and y', () => {
  const tree = renderer
    .create(
      <Svg x={20} y={30} width={100} height={100} transform={[{ scale: 2 }]}>
        <Rect width={10} height={10} />
      </Svg>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

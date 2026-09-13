import * as React from 'react';
import renderer from 'react-test-renderer';
import Svg, { Rect } from '../src';
import extractBrush from '../src/lib/extract/extractBrush';

/* eslint-disable @typescript-eslint/no-explicit-any */

const shapeProps = (element: React.ReactElement) => {
  const tree = renderer.create(element).toJSON() as any;
  return tree.children[0].children[0].props;
};

const grad = { type: 1, brushRef: 'grad' };

test('resolves an unquoted url() paint reference', () => {
  expect(extractBrush('url(#grad)')).toEqual(grad);
});

test('resolves a quoted url() paint reference', () => {
  expect(extractBrush("url('#grad')")).toEqual(grad);
  expect(extractBrush('url("#grad")')).toEqual(grad);
});

test('ignores whitespace inside a url() paint reference', () => {
  expect(extractBrush('url( #grad )')).toEqual(grad);
  expect(extractBrush("url( '#grad' )")).toEqual(grad);
});

test('still resolves plain colors and keywords', () => {
  expect(extractBrush('none')).toBeNull();
  expect(extractBrush('currentColor')).toEqual({ type: 2 });
  expect(extractBrush('red')).toEqual({ type: 0, payload: expect.any(Number) });
});

test('applies a quoted url() paint reference to fill and stroke', () => {
  const props = shapeProps(
    <Svg>
      <Rect fill="url('#grad')" stroke="url( #grad )" />
    </Svg>
  );
  expect(props.fill).toEqual(grad);
  expect(props.stroke).toEqual(grad);
});

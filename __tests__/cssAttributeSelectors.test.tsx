import * as React from 'react';
import renderer from 'react-test-renderer';
import { SvgCss } from '../src/css/css';

describe('CSS attribute selectors', () => {
  test('matches numeric zero and empty attribute values', () => {
    const xml = `
      <svg>
        <style>
          rect[stroke-width="0"] { fill: red; }
          rect[data-empty=""] { stroke: blue; }
        </style>
        <rect stroke-width="0" data-empty="" width="1" height="1" />
      </svg>
    `;
    const tree = renderer.create(<SvgCss xml={xml} />);
    const rect = tree.root.findByType('RNSVGRect' as React.ElementType);

    expect(rect.props.fill).toBeDefined();
    expect(rect.props.stroke).toBeDefined();
  });
});

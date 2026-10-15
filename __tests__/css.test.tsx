import * as React from 'react';
import renderer from 'react-test-renderer';
import { parse } from '../src/ReactNativeSVG';
import { type CssVars, SvgCss, inlineStyles } from '../src/css';

const xml = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
     width="100%" height="100%" viewBox="0 0 1000 500">
  <defs>
    <style type="text/css">
      /* tag selector */
      rect {
        stroke: blue;
        fill: yellow
      }

      /* class selector */
      .redbox { fill: red; }

      /* multiple selectors */
      g .class-1, g .class-2 {
        stroke-width: 16
      }

      /* two classes */
      .class-2.transparent {
        fill-opacity: 0.3;
      }

      /* Commented out
      rect {
        fill: black;
      }
      */
    </style>
  </defs>
  <g>
    <rect class="redbox class-1" x="100" y="0" width="1000" height="200" />
  </g>
  <g>
    <rect class="redbox class-2 transparent" x="100" y="350" width="750" height="200" />
  </g>
</svg>`;

test('inlines styles', () => {
  const ast = parse(xml, inlineStyles);
  expect(ast).toMatchSnapshot();
});

test('supports CSS in style element', () => {
  const tree = renderer.create(<SvgCss xml={xml} />).toJSON();
  expect(tree).toMatchSnapshot();
});

const svgWithVar = (style = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
    ${style ? `<style>${style}</style>` : ''}
    <rect width="10" height="10" fill="var(--brand)" />
  </svg>`;

const rectFill = (svg: string, cssVars?: CssVars) => {
  const ast = parse(svg, (document) => inlineStyles(document, cssVars)) as {
    children: { props?: { fill?: string } }[];
  };
  return ast.children.find((c) => c.props && 'fill' in c.props)?.props?.fill;
};

test('cssVars resolve var() when no <style> is present', () => {
  expect(rectFill(svgWithVar(), { '--brand': 'red' })).toBe('red');
});

test('cssVars resolve var() that a <style> does not declare', () => {
  const svg = svgWithVar('rect { stroke: blue; }');
  expect(rectFill(svg, { '--brand': 'red' })).toBe('red');
});

test('variables declared in <style> take precedence over cssVars', () => {
  const svg = svgWithVar(':root { --brand: green; }');
  expect(rectFill(svg, { '--brand': 'red' })).toBe('green');
});

test('SvgCss renders with cssVars prop', () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
    <rect width="10" height="10" fill="var(--brand)" />
  </svg>`;
  const tree = renderer
    .create(<SvgCss xml={svg} cssVars={{ '--brand': '#ff0000' }} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

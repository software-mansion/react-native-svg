import type { ReactElement } from 'react';
import renderer from 'react-test-renderer';
import { StyleSheet } from 'react-native';
import Svg, { Path, SvgXml } from '../src';

const renderRoot = (element: ReactElement) => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(element);
  });
  const root = tree.root.find((node) => String(node.type) === 'RNSVGSvgView');
  return {
    style: StyleSheet.flatten(root.props.style),
    bbWidth: root.props.bbWidth,
    bbHeight: root.props.bbHeight,
  };
};

describe('Svg root size', () => {
  test('keeps fractional numeric width and height', () => {
    const height = 10;
    const width = height * (94.3941 / 56.96);
    const { style, bbWidth, bbHeight } = renderRoot(
      <Svg height={height} width={width} viewBox="15.5309 37 94.3941 56.96">
        <Path d="M15.5309 37H64.3309V47.56H15.5309Z" />
      </Svg>
    );
    expect(style.width).toBe(width);
    expect(style.height).toBe(10);
    expect(bbWidth).toBe(width);
    expect(bbHeight).toBe(10);
  });

  test('keeps fractional numeric strings', () => {
    const { style } = renderRoot(<Svg width="24.5" height="12.75" />);
    expect(style.width).toBe(24.5);
    expect(style.height).toBe(12.75);
  });

  test('keeps fractional width and height from SvgXml markup', () => {
    const { style } = renderRoot(
      <SvgXml xml='<svg width="595.28" height="841.89"><rect width="10" height="10"/></svg>' />
    );
    expect(style.width).toBe(595.28);
    expect(style.height).toBe(841.89);
  });

  test('converts integer and unit strings to numbers', () => {
    expect(renderRoot(<Svg width={24} height={32} />).style).toMatchObject({
      width: 24,
      height: 32,
    });
    expect(renderRoot(<Svg width="24" height="32" />).style).toMatchObject({
      width: 24,
      height: 32,
    });
    expect(renderRoot(<Svg width="24px" height="32px" />).style).toMatchObject({
      width: 24,
      height: 32,
    });
  });

  test('passes percentages and the default size through as strings', () => {
    expect(renderRoot(<Svg width="50%" height="25.5%" />).style).toMatchObject({
      width: '50%',
      height: '25.5%',
    });
    expect(renderRoot(<Svg />).style).toMatchObject({
      width: '100%',
      height: '100%',
    });
  });
});

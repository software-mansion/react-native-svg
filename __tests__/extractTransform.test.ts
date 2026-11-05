import { props2transform } from '../src/lib/extract/extractTransform';

describe('props2transform', () => {
  test('lets an explicit translateX/Y of 0 override the deprecated x/y props', () => {
    const result = props2transform({
      x: 10,
      y: 20,
      translateX: 0,
      translateY: 0,
    });
    expect(result?.x).toBe(0);
    expect(result?.y).toBe(0);
  });

  test('lets an explicit translateX/Y of 0 override the translate prop', () => {
    const result = props2transform({
      translate: [10, 20],
      translateX: 0,
      translateY: 0,
    });
    expect(result?.x).toBe(0);
    expect(result?.y).toBe(0);
  });

  test('still falls back to the deprecated x/y props when translateX/Y are absent', () => {
    const result = props2transform({ x: 10, y: 20 });
    expect(result?.x).toBe(10);
    expect(result?.y).toBe(20);
  });
});

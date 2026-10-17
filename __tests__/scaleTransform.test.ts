import { props2transform } from '../src/lib/extract/extractTransform';
import { stringifyTransformProps } from '../src/web/utils/parseTransform';

describe('zero scale transforms', () => {
  test('preserves a zero scale on the native path', () => {
    expect(props2transform({ scale: 0 })).toMatchObject({
      scaleX: 0,
      scaleY: 0,
    });
    expect(props2transform({ scaleX: 0, scaleY: 0 })).toMatchObject({
      scaleX: 0,
      scaleY: 0,
    });
    expect(props2transform({ scaleX: 0 })).toMatchObject({
      scaleX: 0,
      scaleY: 1,
    });
  });

  test('preserves a zero axis scale on the web path', () => {
    expect(stringifyTransformProps({ scaleX: 0, scaleY: 0 })).toEqual([
      'scale(0, 0)',
    ]);
    expect(stringifyTransformProps({ scaleX: 0 })).toEqual(['scale(0, 1)']);
  });
});

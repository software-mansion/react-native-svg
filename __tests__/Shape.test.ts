import { SVGMatrix } from '../src/elements/Shape';

describe('SVGMatrix', () => {
  test('rotates toward a vector using its angle in radians', () => {
    const rotation = new SVGMatrix().rotateFromVector(0, 1);

    expect(rotation.a).toBeCloseTo(0);
    expect(rotation.b).toBeCloseTo(1);
    expect(rotation.c).toBeCloseTo(-1);
    expect(rotation.d).toBeCloseTo(0);
  });
});

import * as React from 'react';
import renderer from 'react-test-renderer';
import RadialGradient from '../src/elements/RadialGradient';

describe('RadialGradient', () => {
  test('preserves explicit zero radii', () => {
    const gradient = renderer
      .create(<RadialGradient r={10} rx={0} ry={0} />)
      .toJSON();

    expect(gradient).toMatchObject({
      props: { rx: 0, ry: 0 },
    });
  });
});

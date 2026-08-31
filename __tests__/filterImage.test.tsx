import * as React from 'react';
import renderer from 'react-test-renderer';
import { FilterImage } from '../src/filter-image/FilterImage';

describe('FilterImage', () => {
  test('preserves explicit zero dimensions', () => {
    const image = renderer
      .create(
        <FilterImage
          source={{ uri: 'image.png', width: 100, height: 100 }}
          width={0}
          height={0}
        />
      )
      .toJSON();

    expect(image).toMatchObject({
      props: {
        style: [expect.anything(), { width: 0, height: 0, overflow: 'hidden' }],
      },
    });
  });

  test('preserves zero dimensions from styles', () => {
    const image = renderer
      .create(
        <FilterImage
          source={{ uri: 'image.png', width: 100, height: 100 }}
          style={{ width: 0, height: 0 }}
        />
      )
      .toJSON();

    expect(image).toMatchObject({
      props: {
        style: [
          { width: 0, height: 0 },
          { width: 0, height: 0, overflow: 'hidden' },
        ],
      },
    });
  });
});

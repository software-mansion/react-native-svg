import * as React from 'react';
import Stop from '../src/elements/Stop';
import extractGradient from '../src/lib/extract/extractGradient';

function extractOffsets(offsets: number[]) {
  const result = extractGradient(
    {
      id: 'gradient',
      children: offsets.map((offset) => (
        <Stop key={offset} offset={offset} stopColor="black" />
      )),
    },
    null
  );

  return result?.gradient.filter((_, index) => index % 2 === 0);
}

describe('extractGradient', () => {
  test('keeps stop order and raises decreasing offsets', () => {
    expect(extractOffsets([0.8, 0.2])).toEqual([0.8, 0.8]);
  });

  test('clamps stop offsets to the gradient range', () => {
    expect(extractOffsets([-1, 2])).toEqual([0, 1]);
  });
});

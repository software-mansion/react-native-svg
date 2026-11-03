import { extractFeGaussianBlur } from '../src/lib/extract/extractFilter';

describe('extractFeGaussianBlur', () => {
  test.each<[number[] | string, number, number]>([
    [[5], 5, 5],
    [' 5 ', 5, 5],
    ['5, 10', 5, 10],
  ])(
    'normalizes stdDeviation %p to both axes',
    (stdDeviation, expectedX, expectedY) => {
      expect(extractFeGaussianBlur({ stdDeviation })).toMatchObject({
        stdDeviationX: expectedX,
        stdDeviationY: expectedY,
      });
    }
  );
});

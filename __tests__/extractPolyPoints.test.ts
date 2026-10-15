import extractPolyPoints from '../src/lib/extract/extractPolyPoints';

describe('extractPolyPoints', () => {
  test('separates adjacent negative coordinates without changing digits', () => {
    expect(extractPolyPoints('0,0 10-10 20-20')).toBe(
      '0 0 10 -10 20 -20'
    );
  });

  test('does not split a negative exponent', () => {
    expect(extractPolyPoints('1e-3,-2')).toBe('1e-3 -2');
  });
});

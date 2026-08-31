import extractProps from '../src/lib/extract/extractProps';

describe('extractStroke', () => {
  test('preserves a dash offset without a local dash array', () => {
    expect(extractProps({ strokeDashoffset: 5 }, {})).toMatchObject({
      strokeDashoffset: 5,
      propList: ['strokeDashoffset'],
    });
  });

  test('preserves an explicit zero dash offset', () => {
    expect(extractProps({ strokeDashoffset: 0 }, {})).toMatchObject({
      strokeDashoffset: 0,
      propList: ['strokeDashoffset'],
    });
  });
});

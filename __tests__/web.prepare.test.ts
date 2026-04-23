import { prepare } from '../src/web/utils/prepare';
import type { WebShape } from '../src/web/WebShape';
import type { BaseProps } from '../src/web/types';

function mockSelf() {
  return {
    elementRef: { current: null },
  } as unknown as WebShape<BaseProps>;
}

describe('prepare', () => {
  it('preserves onClick when onPress is not provided', () => {
    const handler = jest.fn();
    const result = prepare(mockSelf(), { onClick: handler } as BaseProps);
    expect(result.onClick).toBe(handler);
  });

  it('maps onPress to onClick', () => {
    const handler = jest.fn();
    const result = prepare(mockSelf(), { onPress: handler } as BaseProps);
    expect(result.onClick).toBe(handler);
  });

  it('onPress takes precedence over onClick', () => {
    const clickHandler = jest.fn();
    const pressHandler = jest.fn();
    const result = prepare(mockSelf(), {
      onClick: clickHandler,
      onPress: pressHandler,
    } as BaseProps);
    expect(result.onClick).toBe(pressHandler);
  });

  it('does not set onClick when neither onClick nor onPress provided', () => {
    const result = prepare(mockSelf(), {} as BaseProps);
    expect(result.onClick).toBeUndefined();
  });
});

import { prepare } from '../src/web/utils/prepare';
import type { WebShape } from '../src/web/WebShape';
import type { BaseProps } from '../src/web/types';

const createSelf = (props: BaseProps) =>
  ({
    props,
    elementRef: { current: null },
  }) as unknown as WebShape<BaseProps>;

describe('prepare', () => {
  test('keeps a user-supplied onClick when onPress is not set', () => {
    const onClick = jest.fn();
    const clean = prepare(createSelf({ onClick }), { onClick });
    expect(clean.onClick).toBe(onClick);
  });

  test('maps onPress to onClick', () => {
    const onPress = jest.fn();
    const clean = prepare(createSelf({ onPress }), { onPress });
    expect(clean.onClick).toBe(onPress);
  });

  test('prefers onPress over a user-supplied onClick', () => {
    const onClick = jest.fn();
    const onPress = jest.fn();
    const clean = prepare(createSelf({ onClick, onPress }), {
      onClick,
      onPress,
    });
    expect(clean.onClick).toBe(onPress);
  });
});

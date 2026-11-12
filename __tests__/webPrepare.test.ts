import { prepare } from '../src/web/utils/prepare';
import { getAttributeName } from '../src/web/utils';
import type { BaseProps } from '../src/web/types';
import type { WebShape } from '../src/web/WebShape';

const prepareProps = (props: BaseProps & Record<string, unknown>) =>
  prepare({ elementRef: { current: null } } as unknown as WebShape, props);

describe('web prepare', () => {
  it('does not pass React Native only accessibility props to the DOM', () => {
    const clean = prepareProps({
      accessible: false,
      accessibilityElementsHidden: false,
      importantForAccessibility: 'auto',
    });

    expect(clean).not.toHaveProperty('accessible');
    expect(clean).not.toHaveProperty('accessibilityElementsHidden');
    expect(clean).not.toHaveProperty('importantForAccessibility');
    expect(clean).not.toHaveProperty('aria-hidden');
  });

  it('maps hidden accessibility props to aria-hidden', () => {
    expect(prepareProps({ accessibilityElementsHidden: true })).toHaveProperty(
      'aria-hidden',
      true
    );
    expect(
      prepareProps({ importantForAccessibility: 'no-hide-descendants' })
    ).toHaveProperty('aria-hidden', true);
  });

  it('keeps aria-hidden when it is set', () => {
    expect(
      prepareProps({ accessibilityElementsHidden: true, 'aria-hidden': false })
    ).toHaveProperty('aria-hidden', false);
  });

  it('passes the origin as transformOrigin', () => {
    const fromOrigin = prepareProps({ origin: [10, 20] });
    expect(fromOrigin).toHaveProperty('transformOrigin', '10 20');
    expect(fromOrigin).not.toHaveProperty('transform-origin');

    expect(prepareProps({ originX: 5 })).toHaveProperty(
      'transformOrigin',
      '5 0'
    );
    expect(getAttributeName('transformOrigin')).toBe('transform-origin');
  });
});

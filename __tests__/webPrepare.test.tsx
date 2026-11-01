import { WebShape } from '../src/web/WebShape';
import { prepare } from '../src/web/utils/prepare';
import type { BaseProps } from '../src/web/types';

const propsUnknownToReactDOM = [
  'onStartShouldSetResponder',
  'onResponderTerminationRequest',
  'onResponderGrant',
  'onResponderMove',
  'onResponderRelease',
  'onResponderTerminate',
  'onPressIn',
  'onPressOut',
  'onLongPress',
];

const prepareShape = (props: BaseProps) => prepare(new WebShape(props));

describe('prepare on web', () => {
  test.each(['onPress', 'onPressIn', 'onPressOut', 'onLongPress'])(
    'only passes props known to React DOM for %s',
    (handler) => {
      const clean = prepareShape({ [handler]: jest.fn() });

      propsUnknownToReactDOM.forEach((prop) => {
        expect(clean).not.toHaveProperty(prop);
      });
    }
  );

  test('maps onPress to onClick', () => {
    const onPress = jest.fn();

    expect(prepareShape({ onPress }).onClick).toBe(onPress);
  });
});

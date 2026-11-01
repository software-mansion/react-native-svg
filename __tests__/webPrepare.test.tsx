import { WebShape } from '../src/web/WebShape';
import { prepare } from '../src/web/utils/prepare';
import type { BaseProps } from '../src/web/types';

const responderProps = [
  'onStartShouldSetResponder',
  'onResponderTerminationRequest',
  'onResponderGrant',
  'onResponderMove',
  'onResponderRelease',
  'onResponderTerminate',
];

const prepareShape = (props: BaseProps) => prepare(new WebShape(props));

describe('prepare on web', () => {
  test.each(['onPress', 'onPressIn', 'onPressOut', 'onLongPress'])(
    'does not pass responder props to the DOM element for %s',
    (handler) => {
      const clean = prepareShape({ [handler]: jest.fn() });

      responderProps.forEach((prop) => {
        expect(clean).not.toHaveProperty(prop);
      });
    }
  );

  test('maps onPress to onClick', () => {
    const onPress = jest.fn();

    expect(prepareShape({ onPress }).onClick).toBe(onPress);
  });
});

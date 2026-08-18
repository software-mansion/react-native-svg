import renderer from 'react-test-renderer';
import Svg, { Rect } from '../src';

// Fake native ref: measure() reports a 100x100 view at page offset (0, 0).
const createTarget = () => ({
  measure: (
    callback: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number
    ) => void
  ) => callback(0, 0, 100, 100, 0, 0), // eslint-disable-line n/no-callback-literal
});

const createTouchEvent = (target: unknown, pageX = 50, pageY = 50) => ({
  persist: jest.fn(),
  currentTarget: target,
  nativeEvent: {
    pageX,
    pageY,
    locationX: pageX,
    locationY: pageY,
    identifier: 1,
    target,
    timestamp: 100,
    touches: [],
    changedTouches: [],
  },
});

/* eslint-disable @typescript-eslint/no-explicit-any */
type Handlers = {
  onStartShouldSetResponder: (e: any) => boolean;
  onResponderGrant: (e: any) => void;
  onResponderMove: (e: any) => void;
  onResponderRelease: (e: any) => void;
  onResponderTerminate: (e: any) => void;
  onResponderTerminationRequest: (e: any) => boolean;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const renderRect = (props: object) => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(
      <Svg width="200" height="200">
        <Rect x="0" y="0" width="100" height="100" {...props} />
      </Svg>
    );
  });
  const nodes = tree.root.findAll(
    (node) =>
      typeof node.type === 'string' &&
      node.props.onStartShouldSetResponder != null
  );
  return { tree, handlers: (nodes[0]?.props ?? {}) as Handlers, nodes };
};

describe('touchable behavior of SVG elements', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('does not attach responder handlers without touchable props', () => {
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(
        <Svg width="200" height="200">
          <Rect x="0" y="0" width="100" height="100" fill="red" />
        </Svg>
      );
    });
    const responders = tree.root.findAll(
      (node) =>
        typeof node.type === 'string' &&
        node.props.onStartShouldSetResponder != null
    );
    expect(responders).toHaveLength(0);
  });

  test('attaches all responder handlers when onPress is set', () => {
    const { handlers, nodes } = renderRect({ onPress: jest.fn() });
    expect(nodes).toHaveLength(1);
    expect(typeof handlers.onStartShouldSetResponder).toBe('function');
    expect(typeof handlers.onResponderGrant).toBe('function');
    expect(typeof handlers.onResponderMove).toBe('function');
    expect(typeof handlers.onResponderRelease).toBe('function');
    expect(typeof handlers.onResponderTerminate).toBe('function');
    expect(typeof handlers.onResponderTerminationRequest).toBe('function');
    expect((handlers as { responsible?: boolean }).responsible).toBe(true);
  });

  test('keeps accessibility props on the host element', () => {
    const { nodes } = renderRect({
      onPress: jest.fn(),
      accessible: true,
      accessibilityLabel: 'a rectangle',
    });
    const props = nodes[0].props as {
      accessible?: boolean;
      accessibilityLabel?: string;
    };
    expect(props.accessible).toBe(true);
    expect(props.accessibilityLabel).toBe('a rectangle');
  });

  test('calls onPressIn, onPress and onPressOut on tap', () => {
    const onPress = jest.fn();
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();

    const { handlers } = renderRect({ onPress, onPressIn, onPressOut });
    const target = createTarget();

    expect(handlers.onStartShouldSetResponder(createTouchEvent(target))).toBe(
      true
    );

    handlers.onResponderGrant(createTouchEvent(target));
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();

    handlers.onResponderRelease(createTouchEvent(target));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);

    const pressInOrder = onPressIn.mock.invocationCallOrder[0];
    const pressOrder = onPress.mock.invocationCallOrder[0];
    expect(pressInOrder).toBeLessThan(pressOrder);
  });

  test('respects delayPressIn', () => {
    const onPressIn = jest.fn();

    const { handlers } = renderRect({
      onPress: jest.fn(),
      onPressIn,
      delayPressIn: 100,
    });

    const target = createTarget();
    handlers.onResponderGrant(createTouchEvent(target));
    expect(onPressIn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(99);
    expect(onPressIn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(onPressIn).toHaveBeenCalledTimes(1);
  });

  test('respects delayPressOut', () => {
    const onPressOut = jest.fn();

    const { handlers } = renderRect({
      onPress: jest.fn(),
      onPressOut,
      delayPressOut: 100,
    });

    const target = createTarget();
    handlers.onResponderGrant(createTouchEvent(target));
    handlers.onResponderRelease(createTouchEvent(target));
    expect(onPressOut).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  test('calls onLongPress after 500ms and suppresses onPress', () => {
    const onPress = jest.fn();
    const onLongPress = jest.fn();
    const { handlers } = renderRect({ onPress, onLongPress });
    const target = createTarget();

    handlers.onResponderGrant(createTouchEvent(target));
    jest.advanceTimersByTime(499);
    expect(onLongPress).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(onLongPress).toHaveBeenCalledTimes(1);

    handlers.onResponderRelease(createTouchEvent(target));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('respects delayLongPress', () => {
    const onLongPress = jest.fn();

    const { handlers } = renderRect({
      onPress: jest.fn(),
      onLongPress,
      delayLongPress: 200,
    });

    const target = createTarget();
    handlers.onResponderGrant(createTouchEvent(target));
    jest.advanceTimersByTime(199);
    expect(onLongPress).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  test('does not call onLongPress when released early', () => {
    const onPress = jest.fn();
    const onLongPress = jest.fn();
    const { handlers } = renderRect({ onPress, onLongPress });
    const target = createTarget();

    handlers.onResponderGrant(createTouchEvent(target));
    jest.advanceTimersByTime(100);
    handlers.onResponderRelease(createTouchEvent(target));
    jest.advanceTimersByTime(1000);
    expect(onLongPress).not.toHaveBeenCalled();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('cancels long press when the touch moves more than 10px', () => {
    const onPress = jest.fn();
    const onLongPress = jest.fn();
    const { handlers } = renderRect({ onPress, onLongPress });
    const target = createTarget();

    handlers.onResponderGrant(createTouchEvent(target, 50, 50));
    handlers.onResponderMove(createTouchEvent(target, 70, 50));
    jest.advanceTimersByTime(1000);
    expect(onLongPress).not.toHaveBeenCalled();

    handlers.onResponderRelease(createTouchEvent(target, 70, 50));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('cancels the press when the touch leaves the press rect', () => {
    const onPress = jest.fn();
    const onPressOut = jest.fn();
    const { handlers } = renderRect({ onPress, onPressOut });
    const target = createTarget();

    handlers.onResponderGrant(createTouchEvent(target, 50, 50));
    handlers.onResponderMove(createTouchEvent(target, 200, 50));
    expect(onPressOut).toHaveBeenCalledTimes(1);

    handlers.onResponderRelease(createTouchEvent(target, 200, 50));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('keeps the press within the default press retention offset', () => {
    const onPress = jest.fn();
    const onPressOut = jest.fn();
    const { handlers } = renderRect({ onPress, onPressOut });
    const target = createTarget();

    handlers.onResponderGrant(createTouchEvent(target, 50, 50));
    // 100px wide + 20px default retention offset: 115 stays inside.
    handlers.onResponderMove(createTouchEvent(target, 115, 50));
    expect(onPressOut).not.toHaveBeenCalled();

    handlers.onResponderRelease(createTouchEvent(target, 115, 50));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('restores the press when the touch re-enters the press rect', () => {
    const onPress = jest.fn();
    const onPressIn = jest.fn();
    const { handlers } = renderRect({ onPress, onPressIn });
    const target = createTarget();

    handlers.onResponderGrant(createTouchEvent(target, 50, 50));
    handlers.onResponderMove(createTouchEvent(target, 200, 50));
    handlers.onResponderMove(createTouchEvent(target, 50, 50));
    expect(onPressIn).toHaveBeenCalledTimes(2);

    handlers.onResponderRelease(createTouchEvent(target, 50, 50));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('extends the press rect with hitSlop', () => {
    const onPress = jest.fn();

    const { handlers } = renderRect({
      onPress,
      hitSlop: { top: 0, left: 0, right: 80, bottom: 0 },
    });

    const target = createTarget();
    handlers.onResponderGrant(createTouchEvent(target, 50, 50));
    // 100px wide + 20px retention + 80px hitSlop: 190 stays inside.
    handlers.onResponderMove(createTouchEvent(target, 190, 50));
    handlers.onResponderRelease(createTouchEvent(target, 190, 50));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('does not become responder when disabled', () => {
    const onPress = jest.fn();
    const { handlers } = renderRect({ onPress, disabled: true });
    const target = createTarget();

    expect(handlers.onStartShouldSetResponder(createTouchEvent(target))).toBe(
      false
    );
  });

  test('prefers user-supplied responder handlers', () => {
    const onStartShouldSetResponder = jest.fn(() => false);
    const onResponderTerminationRequest = jest.fn(() => false);

    const { handlers } = renderRect({
      onPress: jest.fn(),
      onStartShouldSetResponder,
      onResponderTerminationRequest,
    });

    const target = createTarget();

    expect(handlers.onStartShouldSetResponder(createTouchEvent(target))).toBe(
      false
    );
    expect(onStartShouldSetResponder).toHaveBeenCalledTimes(1);
    expect(
      handlers.onResponderTerminationRequest(createTouchEvent(target))
    ).toBe(false);
    expect(onResponderTerminationRequest).toHaveBeenCalledTimes(1);
  });

  test('allows responder termination by default', () => {
    const { handlers } = renderRect({ onPress: jest.fn() });
    expect(
      handlers.onResponderTerminationRequest(createTouchEvent(createTarget()))
    ).toBe(true);
  });

  test('termination cancels the press', () => {
    const onPress = jest.fn();
    const onPressOut = jest.fn();
    const { handlers } = renderRect({ onPress, onPressOut });
    const target = createTarget();

    handlers.onResponderGrant(createTouchEvent(target));
    handlers.onResponderTerminate(createTouchEvent(target));
    expect(onPressOut).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('clears pending long press timer on unmount', () => {
    const onLongPress = jest.fn();

    const { tree, handlers } = renderRect({
      onPress: jest.fn(),
      onLongPress,
    });

    const target = createTarget();
    handlers.onResponderGrant(createTouchEvent(target));
    renderer.act(() => {
      tree.unmount();
    });
    jest.advanceTimersByTime(1000);
    expect(onLongPress).not.toHaveBeenCalled();
  });
});

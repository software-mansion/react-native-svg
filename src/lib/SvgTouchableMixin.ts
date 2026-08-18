import type { GestureResponderEvent, Insets } from 'react-native';
import { Platform } from 'react-native';

/**
 * Self-contained port of the press interaction state machine from
 * react-native's deprecated `Touchable.Mixin`. It uses the gesture responder
 * system directly, so it works without the core `Touchable` API.
 *
 * https://github.com/react/react-native/blob/5e11ed122aa081e9a263b692637c12f0e9e02024/packages/react-native/Libraries/Components/Touchable/Touchable.js
 */

const PRESS_RETENTION_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };
const HIGHLIGHT_DELAY_MS = 130;
const LONG_PRESS_THRESHOLD = 500;
const LONG_PRESS_DELAY_MS = LONG_PRESS_THRESHOLD - HIGHLIGHT_DELAY_MS;
const LONG_PRESS_ALLOWED_MOVEMENT = 10;
const PRESS_EXPAND_PX = 20;

const States = {
  NOT_RESPONDER: 'NOT_RESPONDER',
  RESPONDER_INACTIVE_PRESS_IN: 'RESPONDER_INACTIVE_PRESS_IN',
  RESPONDER_INACTIVE_PRESS_OUT: 'RESPONDER_INACTIVE_PRESS_OUT',
  RESPONDER_ACTIVE_PRESS_IN: 'RESPONDER_ACTIVE_PRESS_IN',
  RESPONDER_ACTIVE_PRESS_OUT: 'RESPONDER_ACTIVE_PRESS_OUT',
  RESPONDER_ACTIVE_LONG_PRESS_IN: 'RESPONDER_ACTIVE_LONG_PRESS_IN',
  RESPONDER_ACTIVE_LONG_PRESS_OUT: 'RESPONDER_ACTIVE_LONG_PRESS_OUT',
  ERROR: 'ERROR',
} as const;

type State = (typeof States)[keyof typeof States];

const IsActive: Partial<Record<State, boolean>> = {
  RESPONDER_ACTIVE_PRESS_OUT: true,
  RESPONDER_ACTIVE_PRESS_IN: true,
};

const IsPressingIn: Partial<Record<State, boolean>> = {
  RESPONDER_INACTIVE_PRESS_IN: true,
  RESPONDER_ACTIVE_PRESS_IN: true,
  RESPONDER_ACTIVE_LONG_PRESS_IN: true,
};

const IsLongPressingIn: Partial<Record<State, boolean>> = {
  RESPONDER_ACTIVE_LONG_PRESS_IN: true,
};

const Signals = {
  DELAY: 'DELAY',
  RESPONDER_GRANT: 'RESPONDER_GRANT',
  RESPONDER_RELEASE: 'RESPONDER_RELEASE',
  RESPONDER_TERMINATED: 'RESPONDER_TERMINATED',
  ENTER_PRESS_RECT: 'ENTER_PRESS_RECT',
  LEAVE_PRESS_RECT: 'LEAVE_PRESS_RECT',
  LONG_PRESS_DETECTED: 'LONG_PRESS_DETECTED',
} as const;

type Signal = (typeof Signals)[keyof typeof Signals];

const Transitions: Record<State, Record<Signal, State>> = {
  NOT_RESPONDER: {
    DELAY: States.ERROR,
    RESPONDER_GRANT: States.RESPONDER_INACTIVE_PRESS_IN,
    RESPONDER_RELEASE: States.ERROR,
    RESPONDER_TERMINATED: States.ERROR,
    ENTER_PRESS_RECT: States.ERROR,
    LEAVE_PRESS_RECT: States.ERROR,
    LONG_PRESS_DETECTED: States.ERROR,
  },
  RESPONDER_INACTIVE_PRESS_IN: {
    DELAY: States.RESPONDER_ACTIVE_PRESS_IN,
    RESPONDER_GRANT: States.ERROR,
    RESPONDER_RELEASE: States.NOT_RESPONDER,
    RESPONDER_TERMINATED: States.NOT_RESPONDER,
    ENTER_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_IN,
    LEAVE_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_OUT,
    LONG_PRESS_DETECTED: States.ERROR,
  },
  RESPONDER_INACTIVE_PRESS_OUT: {
    DELAY: States.RESPONDER_ACTIVE_PRESS_OUT,
    RESPONDER_GRANT: States.ERROR,
    RESPONDER_RELEASE: States.NOT_RESPONDER,
    RESPONDER_TERMINATED: States.NOT_RESPONDER,
    ENTER_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_IN,
    LEAVE_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_OUT,
    LONG_PRESS_DETECTED: States.ERROR,
  },
  RESPONDER_ACTIVE_PRESS_IN: {
    DELAY: States.ERROR,
    RESPONDER_GRANT: States.ERROR,
    RESPONDER_RELEASE: States.NOT_RESPONDER,
    RESPONDER_TERMINATED: States.NOT_RESPONDER,
    ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_IN,
    LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_OUT,
    LONG_PRESS_DETECTED: States.RESPONDER_ACTIVE_LONG_PRESS_IN,
  },
  RESPONDER_ACTIVE_PRESS_OUT: {
    DELAY: States.ERROR,
    RESPONDER_GRANT: States.ERROR,
    RESPONDER_RELEASE: States.NOT_RESPONDER,
    RESPONDER_TERMINATED: States.NOT_RESPONDER,
    ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_IN,
    LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_OUT,
    LONG_PRESS_DETECTED: States.ERROR,
  },
  RESPONDER_ACTIVE_LONG_PRESS_IN: {
    DELAY: States.ERROR,
    RESPONDER_GRANT: States.ERROR,
    RESPONDER_RELEASE: States.NOT_RESPONDER,
    RESPONDER_TERMINATED: States.NOT_RESPONDER,
    ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_IN,
    LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_OUT,
    LONG_PRESS_DETECTED: States.RESPONDER_ACTIVE_LONG_PRESS_IN,
  },
  RESPONDER_ACTIVE_LONG_PRESS_OUT: {
    DELAY: States.ERROR,
    RESPONDER_GRANT: States.ERROR,
    RESPONDER_RELEASE: States.NOT_RESPONDER,
    RESPONDER_TERMINATED: States.NOT_RESPONDER,
    ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_IN,
    LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_OUT,
    LONG_PRESS_DETECTED: States.ERROR,
  },
  ERROR: {
    DELAY: States.NOT_RESPONDER,
    RESPONDER_GRANT: States.RESPONDER_INACTIVE_PRESS_IN,
    RESPONDER_RELEASE: States.NOT_RESPONDER,
    RESPONDER_TERMINATED: States.NOT_RESPONDER,
    ENTER_PRESS_RECT: States.NOT_RESPONDER,
    LEAVE_PRESS_RECT: States.NOT_RESPONDER,
    LONG_PRESS_DETECTED: States.NOT_RESPONDER,
  },
};

type NativeTouchEvent = GestureResponderEvent['nativeEvent'];

const extractSingleTouch = (nativeEvent: NativeTouchEvent) => {
  const touches = nativeEvent.touches;
  const changedTouches = nativeEvent.changedTouches;
  const hasTouches = touches && touches.length > 0;
  const hasChangedTouches = changedTouches && changedTouches.length > 0;

  return !hasTouches && hasChangedTouches
    ? changedTouches[0]
    : hasTouches
    ? touches[0]
    : nativeEvent;
};

type MeasureCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void;

type Measurable = { measure: (callback: MeasureCallback) => void };

const isMeasurable = (node: unknown): node is Measurable =>
  node != null &&
  typeof node === 'object' &&
  typeof (node as Measurable).measure === 'function';

interface TouchableProps {
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  delayPressIn?: number;
  delayPressOut?: number;
  delayLongPress?: number;
  pressRetentionOffset?: Insets;
  hitSlop?: Insets;
  rejectResponderTermination?: boolean;
  touchSoundDisabled?: boolean;
  onStartShouldSetResponder?: (e: GestureResponderEvent) => boolean;
  onResponderTerminationRequest?: (e: GestureResponderEvent) => boolean;
  onResponderGrant?: (e: GestureResponderEvent) => void;
  onResponderMove?: (e: GestureResponderEvent) => void;
  onResponderRelease?: (e: GestureResponderEvent) => void;
  onResponderTerminate?: (e: GestureResponderEvent) => void;
  onFocus?: (e: unknown) => void;
  onBlur?: (e: unknown) => void;
}

interface TouchableState {
  touchable: {
    touchState: State | undefined;
    responderID: unknown;
    positionOnActivate?: { left: number; top: number } | null;
    dimensionsOnActivate?: { width: number; height: number } | null;
  };
}

interface TouchableInstance {
  props: TouchableProps;
  state: TouchableState;
  root?: unknown;
  touchableDelayTimeout?: ReturnType<typeof setTimeout> | null;
  longPressDelayTimeout?: ReturnType<typeof setTimeout> | null;
  pressOutDelayTimeout?: ReturnType<typeof setTimeout> | null;
  pressInLocation?: {
    pageX: number;
    pageY: number;
    locationX: number;
    locationY: number;
  } | null;
  _remeasureMetricsOnActivation: () => void;
  _handleQueryLayout: MeasureCallback;
  _handleDelay: (e: GestureResponderEvent) => void;
  _handleLongDelay: (e: GestureResponderEvent) => void;
  _receiveSignal: (signal: Signal, e: GestureResponderEvent) => void;
  _cancelLongPressDelayTimeout: () => void;
  _isHighlight: (state: State) => boolean;
  _savePressInLocation: (e: GestureResponderEvent) => void;
  _getDistanceBetweenPoints: (
    aX: number,
    aY: number,
    bX: number,
    bY: number
  ) => number;
  _performSideEffectsForTransition: (
    curState: State,
    nextState: State,
    signal: Signal,
    e: GestureResponderEvent
  ) => void;
  _startHighlight: (e: GestureResponderEvent) => void;
  _endHighlight: (e: GestureResponderEvent) => void;
  touchableHandlePress: (e: GestureResponderEvent) => void;
  touchableHandleActivePressIn: (e: GestureResponderEvent) => void;
  touchableHandleActivePressOut: (e: GestureResponderEvent) => void;
  touchableHandleLongPress: (e: GestureResponderEvent) => void;
  touchableLongPressCancelsPress: () => boolean;
  touchableGetPressRectOffset: () => Insets;
  touchableGetHitSlop: () => Insets | undefined;
  touchableGetHighlightDelayMS: () => number;
  touchableGetLongPressDelayMS: () => number;
  touchableGetPressOutDelayMS: () => number;
}

const touchableGetInitialState = (): TouchableState => ({
  touchable: { touchState: undefined, responderID: null },
});

const SvgTouchableMixin = {
  componentWillUnmount(this: TouchableInstance) {
    this.touchableDelayTimeout && clearTimeout(this.touchableDelayTimeout);
    this.longPressDelayTimeout && clearTimeout(this.longPressDelayTimeout);
    this.pressOutDelayTimeout && clearTimeout(this.pressOutDelayTimeout);
  },

  touchableGetInitialState,

  touchableHandleStartShouldSetResponder(
    this: TouchableInstance,
    e: GestureResponderEvent
  ): boolean {
    const { onStartShouldSetResponder } = this.props;
    if (onStartShouldSetResponder) {
      return onStartShouldSetResponder(e);
    }
    return !this.props.disabled;
  },

  touchableHandleResponderTerminationRequest(
    this: TouchableInstance,
    e: GestureResponderEvent
  ): boolean {
    const { onResponderTerminationRequest } = this.props;
    if (onResponderTerminationRequest) {
      return onResponderTerminationRequest(e);
    }
    return !this.props.rejectResponderTermination;
  },

  touchableLongPressCancelsPress(): boolean {
    return true;
  },

  touchableHandleResponderGrant(
    this: TouchableInstance,
    e: GestureResponderEvent
  ) {
    const { onResponderGrant } = this.props;
    if (onResponderGrant) {
      return onResponderGrant(e);
    }

    const dispatchID = e.currentTarget;
    // The event is reused in timer callbacks, so it must leave the pool.
    e.persist();

    this.pressOutDelayTimeout && clearTimeout(this.pressOutDelayTimeout);
    this.pressOutDelayTimeout = null;

    this.state.touchable.touchState = States.NOT_RESPONDER;
    this.state.touchable.responderID = dispatchID;
    this._receiveSignal(Signals.RESPONDER_GRANT, e);

    let delayMS = Math.max(this.touchableGetHighlightDelayMS(), 0);
    delayMS = isNaN(delayMS) ? HIGHLIGHT_DELAY_MS : delayMS;
    if (delayMS !== 0) {
      this.touchableDelayTimeout = setTimeout(
        () => this._handleDelay(e),
        delayMS
      );
    } else {
      this._handleDelay(e);
    }

    let longDelayMS = Math.max(this.touchableGetLongPressDelayMS(), 10);
    longDelayMS = isNaN(longDelayMS) ? LONG_PRESS_DELAY_MS : longDelayMS;
    this.longPressDelayTimeout = setTimeout(
      () => this._handleLongDelay(e),
      longDelayMS + delayMS
    );
  },

  touchableHandleResponderRelease(
    this: TouchableInstance,
    e: GestureResponderEvent
  ) {
    const { onResponderRelease } = this.props;
    if (onResponderRelease) {
      return onResponderRelease(e);
    }
    this.pressInLocation = null;
    this._receiveSignal(Signals.RESPONDER_RELEASE, e);
  },

  touchableHandleResponderTerminate(
    this: TouchableInstance,
    e: GestureResponderEvent
  ) {
    const { onResponderTerminate } = this.props;
    if (onResponderTerminate) {
      return onResponderTerminate(e);
    }
    this.pressInLocation = null;
    this._receiveSignal(Signals.RESPONDER_TERMINATED, e);
  },

  touchableHandleResponderMove(
    this: TouchableInstance,
    e: GestureResponderEvent
  ) {
    const { onResponderMove } = this.props;
    if (onResponderMove) {
      return onResponderMove(e);
    }

    const { positionOnActivate, dimensionsOnActivate } = this.state.touchable;

    // Measurement may not have returned yet.
    if (!positionOnActivate || !dimensionsOnActivate) {
      return;
    }

    const pressRectOffset = this.touchableGetPressRectOffset();

    let pressExpandLeft = pressRectOffset.left ?? PRESS_EXPAND_PX;
    let pressExpandTop = pressRectOffset.top ?? PRESS_EXPAND_PX;
    let pressExpandRight = pressRectOffset.right ?? PRESS_EXPAND_PX;
    let pressExpandBottom = pressRectOffset.bottom ?? PRESS_EXPAND_PX;

    const hitSlop = this.touchableGetHitSlop();
    if (hitSlop) {
      pressExpandLeft += hitSlop.left || 0;
      pressExpandTop += hitSlop.top || 0;
      pressExpandRight += hitSlop.right || 0;
      pressExpandBottom += hitSlop.bottom || 0;
    }

    const touch = extractSingleTouch(e.nativeEvent);
    const pageX = touch && touch.pageX;
    const pageY = touch && touch.pageY;

    if (this.pressInLocation) {
      const movedDistance = this._getDistanceBetweenPoints(
        pageX,
        pageY,
        this.pressInLocation.pageX,
        this.pressInLocation.pageY
      );
      if (movedDistance > LONG_PRESS_ALLOWED_MOVEMENT) {
        this._cancelLongPressDelayTimeout();
      }
    }

    const isTouchWithinActive =
      pageX > positionOnActivate.left - pressExpandLeft &&
      pageY > positionOnActivate.top - pressExpandTop &&
      pageX <
        positionOnActivate.left +
          dimensionsOnActivate.width +
          pressExpandRight &&
      pageY <
        positionOnActivate.top +
          dimensionsOnActivate.height +
          pressExpandBottom;

    if (isTouchWithinActive) {
      const prevState = this.state.touchable.touchState;
      this._receiveSignal(Signals.ENTER_PRESS_RECT, e);
      const curState = this.state.touchable.touchState;
      if (
        curState === States.RESPONDER_INACTIVE_PRESS_IN &&
        prevState !== States.RESPONDER_INACTIVE_PRESS_IN
      ) {
        this._cancelLongPressDelayTimeout();
      }
    } else {
      this._cancelLongPressDelayTimeout();
      this._receiveSignal(Signals.LEAVE_PRESS_RECT, e);
    }
  },

  touchableHandleFocus(this: TouchableInstance, e: unknown) {
    this.props.onFocus && this.props.onFocus(e);
  },

  touchableHandleBlur(this: TouchableInstance, e: unknown) {
    this.props.onBlur && this.props.onBlur(e);
  },

  touchableHandlePress(this: TouchableInstance, e: GestureResponderEvent) {
    const { onPress } = this.props;
    onPress && onPress(e);
  },

  touchableHandleActivePressIn(
    this: TouchableInstance,
    e: GestureResponderEvent
  ) {
    const { onPressIn } = this.props;
    onPressIn && onPressIn(e);
  },

  touchableHandleActivePressOut(
    this: TouchableInstance,
    e: GestureResponderEvent
  ) {
    const { onPressOut } = this.props;
    onPressOut && onPressOut(e);
  },

  touchableHandleLongPress(this: TouchableInstance, e: GestureResponderEvent) {
    const { onLongPress } = this.props;
    onLongPress && onLongPress(e);
  },

  touchableGetPressRectOffset(this: TouchableInstance): Insets {
    const { pressRetentionOffset } = this.props;
    return pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },

  touchableGetHitSlop(this: TouchableInstance): Insets | undefined {
    const { hitSlop } = this.props;
    return hitSlop;
  },

  touchableGetHighlightDelayMS(this: TouchableInstance): number {
    const { delayPressIn } = this.props;
    return delayPressIn || 0;
  },

  touchableGetLongPressDelayMS(this: TouchableInstance): number {
    const { delayLongPress } = this.props;
    return delayLongPress === 0 ? 0 : delayLongPress || LONG_PRESS_THRESHOLD;
  },

  touchableGetPressOutDelayMS(this: TouchableInstance): number {
    const { delayPressOut } = this.props;
    return delayPressOut || 0;
  },

  _remeasureMetricsOnActivation(this: TouchableInstance) {
    const responderID = this.state.touchable.responderID;
    if (responderID == null) {
      return;
    }
    if (isMeasurable(responderID)) {
      responderID.measure(this._handleQueryLayout);
    } else if (isMeasurable(this.root)) {
      this.root.measure(this._handleQueryLayout);
    }
  },

  _handleQueryLayout(
    this: TouchableInstance,
    l: number,
    t: number,
    w: number,
    h: number,
    globalX: number,
    globalY: number
  ) {
    // Ignore empty results from a failed measurement.
    if (!l && !t && !w && !h && !globalX && !globalY) {
      return;
    }
    this.state.touchable.positionOnActivate = { left: globalX, top: globalY };
    this.state.touchable.dimensionsOnActivate = { width: w, height: h };
  },

  _handleDelay(this: TouchableInstance, e: GestureResponderEvent) {
    this.touchableDelayTimeout = null;
    this._receiveSignal(Signals.DELAY, e);
  },

  _handleLongDelay(this: TouchableInstance, e: GestureResponderEvent) {
    this.longPressDelayTimeout = null;
    const curState = this.state.touchable.touchState;
    if (
      curState === States.RESPONDER_ACTIVE_PRESS_IN ||
      curState === States.RESPONDER_ACTIVE_LONG_PRESS_IN
    ) {
      this._receiveSignal(Signals.LONG_PRESS_DETECTED, e);
    }
  },

  _receiveSignal(
    this: TouchableInstance,
    signal: Signal,
    e: GestureResponderEvent
  ) {
    const responderID = this.state.touchable.responderID;
    const curState = this.state.touchable.touchState;
    const nextState = curState && Transitions[curState][signal];
    if (!responderID && signal === Signals.RESPONDER_RELEASE) {
      return;
    }
    if (!nextState) {
      throw new Error(
        `Unrecognized signal \`${signal}\` or state \`${curState}\` for responder`
      );
    }
    if (nextState === States.ERROR) {
      throw new Error(
        `Cannot transition from \`${curState}\` with signal \`${signal}\` for responder`
      );
    }
    if (curState !== nextState) {
      this._performSideEffectsForTransition(curState, nextState, signal, e);
      this.state.touchable.touchState = nextState;
    }
  },

  _cancelLongPressDelayTimeout(this: TouchableInstance) {
    this.longPressDelayTimeout && clearTimeout(this.longPressDelayTimeout);
    this.longPressDelayTimeout = null;
  },

  _isHighlight(state: State): boolean {
    return (
      state === States.RESPONDER_ACTIVE_PRESS_IN ||
      state === States.RESPONDER_ACTIVE_LONG_PRESS_IN
    );
  },

  _savePressInLocation(this: TouchableInstance, e: GestureResponderEvent) {
    const touch = extractSingleTouch(e.nativeEvent);
    const pageX = touch && touch.pageX;
    const pageY = touch && touch.pageY;
    const locationX = touch && touch.locationX;
    const locationY = touch && touch.locationY;
    this.pressInLocation = { pageX, pageY, locationX, locationY };
  },

  _getDistanceBetweenPoints(
    aX: number,
    aY: number,
    bX: number,
    bY: number
  ): number {
    const deltaX = aX - bX;
    const deltaY = aY - bY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  },

  _performSideEffectsForTransition(
    this: TouchableInstance,
    curState: State,
    nextState: State,
    signal: Signal,
    e: GestureResponderEvent
  ) {
    const curIsHighlight = this._isHighlight(curState);
    const newIsHighlight = this._isHighlight(nextState);

    const isFinalSignal =
      signal === Signals.RESPONDER_TERMINATED ||
      signal === Signals.RESPONDER_RELEASE;

    if (isFinalSignal) {
      this._cancelLongPressDelayTimeout();
    }

    const isInitialTransition =
      curState === States.NOT_RESPONDER &&
      nextState === States.RESPONDER_INACTIVE_PRESS_IN;

    const isActiveTransition = !IsActive[curState] && IsActive[nextState];
    if (isInitialTransition || isActiveTransition) {
      this._remeasureMetricsOnActivation();
    }

    if (IsPressingIn[curState] && signal === Signals.LONG_PRESS_DETECTED) {
      this.touchableHandleLongPress(e);
    }

    if (newIsHighlight && !curIsHighlight) {
      this._startHighlight(e);
    } else if (!newIsHighlight && curIsHighlight) {
      this._endHighlight(e);
    }

    if (IsPressingIn[curState] && signal === Signals.RESPONDER_RELEASE) {
      const hasLongPressHandler = !!this.props.onLongPress;

      const pressIsLongButStillCallOnPress =
        !!IsLongPressingIn[curState] &&
        (!hasLongPressHandler || !this.touchableLongPressCancelsPress());

      const shouldInvokePress =
        !IsLongPressingIn[curState] || pressIsLongButStillCallOnPress;

      if (shouldInvokePress) {
        if (!newIsHighlight && !curIsHighlight) {
          // The highlight never fired because of the delay. Fire it now.
          this._startHighlight(e);
          this._endHighlight(e);
        }
        if (Platform.OS === 'android' && !this.props.touchSoundDisabled) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const soundModule = require('../fabric/NativeSvgSoundModule').default;
          soundModule.playTouchSound();
        }
        this.touchableHandlePress(e);
      }
    }

    this.touchableDelayTimeout && clearTimeout(this.touchableDelayTimeout);
    this.touchableDelayTimeout = null;
  },

  _startHighlight(this: TouchableInstance, e: GestureResponderEvent) {
    this._savePressInLocation(e);
    this.touchableHandleActivePressIn(e);
  },

  _endHighlight(this: TouchableInstance, e: GestureResponderEvent) {
    const delayMS = this.touchableGetPressOutDelayMS();
    if (delayMS) {
      this.pressOutDelayTimeout = setTimeout(() => {
        this.touchableHandleActivePressOut(e);
      }, delayMS);
    } else {
      this.touchableHandleActivePressOut(e);
    }
  },
};

const touchKeys = Object.keys(SvgTouchableMixin) as Array<
  keyof typeof SvgTouchableMixin
>;

export default (target: { [x: string]: unknown; state: unknown }) => {
  for (const key of touchKeys) {
    const val = SvgTouchableMixin[key];
    if (typeof val === 'function') {
      target[key] = val.bind(target);
    } else {
      target[key] = val;
    }
  }
  target.state = touchableGetInitialState();
};

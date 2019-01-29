import { PanResponder } from 'react-native';

const responderProps = Object.keys(PanResponder.create({}).panHandlers);
const numResponderProps = responderProps.length;

const touchableProps = [
  'disabled',
  'onPress',
  'onPressIn',
  'onPressOut',
  'onLongPress',
  'delayPressIn',
  'delayPressOut',
  'delayLongPress',
];
const numTouchableProps = touchableProps.length;

function hasTouchableProperty(props) {
  for (let i = 0; i < numTouchableProps; i++) {
    if (props.hasOwnProperty(touchableProps[i])) {
      return true;
    }
  }
  return false;
}

export default function extractResponder(props, ref) {
  const extractedProps = {};

  let responsible = false;
  for (let i = 0; i < numResponderProps; i++) {
    const key = responderProps[i];
    const value = props[key];
    if (value) {
      responsible = true;
      extractedProps[key] = value;
    }
  }

  const pointerEvents = props.pointerEvents;
  if (pointerEvents) {
    extractedProps.pointerEvents = pointerEvents;
  }

  if (hasTouchableProperty(props)) {
    responsible = true;
    Object.assign(extractedProps, {
      onStartShouldSetResponder: ref.touchableHandleStartShouldSetResponder,
      onResponderTerminationRequest:
        ref.touchableHandleResponderTerminationRequest,
      onResponderGrant: ref.touchableHandleResponderGrant,
      onResponderMove: ref.touchableHandleResponderMove,
      onResponderRelease: ref.touchableHandleResponderRelease,
      onResponderTerminate: ref.touchableHandleResponderTerminate,
    });
  }

  if (responsible) {
    extractedProps.responsible = true;
  }

  return extractedProps;
}

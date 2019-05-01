import { PanResponder } from 'react-native';

const responderProps = Object.keys(PanResponder.create({}).panHandlers);
const numResponderProps = responderProps.length;

function hasTouchableProperty(props) {
  return (
    props.disabled != null ||
    props.onPress ||
    props.onPressIn ||
    props.onPressOut ||
    props.onLongPress ||
    props.delayPressIn ||
    props.delayPressOut ||
    props.delayLongPress
  );
}

export default function extractResponder(props, ref) {
  const o = {};

  let responsible = false;
  for (let i = 0; i < numResponderProps; i++) {
    const key = responderProps[i];
    const value = props[key];
    if (value) {
      responsible = true;
      o[key] = value;
    }
  }

  const pointerEvents = props.pointerEvents;
  if (pointerEvents) {
    o.pointerEvents = pointerEvents;
  }

  if (hasTouchableProperty(props)) {
    responsible = true;
    o.onResponderMove = ref.touchableHandleResponderMove;
    o.onResponderGrant = ref.touchableHandleResponderGrant;
    o.onResponderRelease = ref.touchableHandleResponderRelease;
    o.onResponderTerminate = ref.touchableHandleResponderTerminate;
    o.onStartShouldSetResponder = ref.touchableHandleStartShouldSetResponder;
    o.onResponderTerminationRequest = ref.touchableHandleResponderTerminationRequest;
  }

  if (responsible) {
    o.responsible = true;
  }

  return o;
}

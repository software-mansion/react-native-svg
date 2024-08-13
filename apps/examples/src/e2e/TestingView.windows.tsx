import React, {Component} from 'react';
import {Platform, View} from 'react-native';
import * as RNSVG from 'react-native-svg';

const address = ['ios', 'web'].includes(Platform.OS) ? 'localhost' : '10.0.2.2';
const wsUri = `ws://${address}:7123`;

const TestingView = () => {
  return <View></View>;
};

class TestingViewWrapper extends Component {
  static title = 'E2E Testing';

  render() {
    return <TestingView />;
  }
}

const samples = [TestingViewWrapper];
const icon = (
  <RNSVG.Svg height="30" width="30" viewBox="0 0 20 20">
    <RNSVG.Circle
      cx="10"
      cy="10"
      r="8"
      stroke="purple"
      strokeWidth="1"
      fill="pink"
    />
  </RNSVG.Svg>
);

function isFabric(): boolean {
  // @ts-expect-error nativeFabricUIManager is not yet included in the RN types
  return !!global?.nativeFabricUIManager;
}

export {samples, icon};

const createElementFromObject = (
  element: keyof typeof RNSVG,
  props: any,
): React.ReactElement => {
  const children: any[] = [];
  if (props.children) {
    if (Array.isArray(props.children)) {
      props?.children.forEach((child: {type: any; props: any}) =>
        children.push(createElementFromObject(child.type, child?.props)),
      );
    } else if (typeof props.children === 'object') {
      children.push(
        createElementFromObject(props.children.type, props.children?.props),
      );
    } else {
      children.push(props.children);
    }
  }
  return React.createElement(RNSVG[element] as any, {...props, children});
};

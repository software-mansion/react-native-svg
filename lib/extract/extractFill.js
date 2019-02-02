import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import { colorNames } from './extractColor';
import { Platform } from 'react-native';

const fillRules = {
  evenodd: 0,
  nonzero: 1,
};

const fillProps = ['fill', 'fillOpacity', 'fillRule'];
const numFillProps = fillProps.length;

// default fill is black
const defaultFill = [
  0,
  Platform.OS === 'android' ? colorNames.black | 0x0 : colorNames.black,
];

export default function extractFill(props, styleProperties) {
  for (let i = 0; i < numFillProps; i++) {
    const name = fillProps[i];
    if (props.hasOwnProperty(name)) {
      styleProperties.push(name);
    }
  }

  const { fill, fillRule, fillOpacity } = props;
  return {
    fill: !fill && typeof fill !== 'number' ? defaultFill : extractBrush(fill),
    fillRule: fillRules[fillRule] === 0 ? 0 : 1,
    fillOpacity: extractOpacity(fillOpacity),
  };
}

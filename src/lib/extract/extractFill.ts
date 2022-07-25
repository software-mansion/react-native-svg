import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import { extractedProps, FillProps } from './types';
import { processColor } from 'react-native';

const fillRules: { evenodd: number; nonzero: number } = {
  evenodd: 0,
  nonzero: 1,
};

const defaultFill = processColor('black');

export default function extractFill(
  o: extractedProps,
  props: FillProps,
  inherited: string[],
) {
  const { fill, fillRule, fillOpacity } = props;
  if (fill != null) {
    inherited.push('fill');
    o.fill =
      !fill && typeof fill !== 'number' ? defaultFill : extractBrush(fill);
  }
  if (fillOpacity != null) {
    inherited.push('fillOpacity');
    o.fillOpacity = extractOpacity(fillOpacity);
  }
  if (fillRule != null) {
    inherited.push('fillRule');
    o.fillRule = fillRule && fillRules[fillRule] === 0 ? 0 : 1;
  }
}

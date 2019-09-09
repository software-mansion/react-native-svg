import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import { colorNames, integerColor } from './extractColor';
import { FillProps } from './types';

const fillRules: { evenodd: number; nonzero: number } = {
  evenodd: 0,
  nonzero: 1,
};

// default fill is black
const black = colorNames.black;
const defaultFill = [0, integerColor(black as number)];

export default function extractFill(
  props: FillProps,
  styleProperties: string[],
) {
  const { fill, fillRule, fillOpacity } = props;

  if (fill != null) {
    styleProperties.push('fill');
  }
  if (fillOpacity != null) {
    styleProperties.push('fillOpacity');
  }
  if (fillRule != null) {
    styleProperties.push('fillRule');
  }

  return {
    fill: !fill && typeof fill !== 'number' ? defaultFill : extractBrush(fill),
    fillRule: fillRule && fillRules[fillRule] === 0 ? 0 : 1,
    fillOpacity: extractOpacity(fillOpacity),
  };
}

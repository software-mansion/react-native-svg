import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import { colorNames } from './extractColor';
import { FillProps } from './types';

const fillRules: { evenodd: number; nonzero: number } = {
  evenodd: 0,
  nonzero: 1,
};

const defaultFill = colorNames.black;

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

import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import extractLengthList from './extractLengthList';
import { StrokeProps } from './types';

const caps = {
  butt: 0,
  square: 2,
  round: 1,
};

const joins = {
  miter: 0,
  bevel: 2,
  round: 1,
};

const vectorEffects = {
  none: 0,
  default: 0,
  nonScalingStroke: 1,
  'non-scaling-stroke': 1,
  inherit: 2,
  uri: 3,
};

export default function extractStroke(
  props: StrokeProps,
  styleProperties: string[],
) {
  const {
    stroke,
    strokeOpacity,
    strokeLinecap,
    strokeLinejoin,
    strokeDasharray,
    strokeWidth,
    strokeDashoffset,
    strokeMiterlimit,
    vectorEffect,
  } = props;

  if (stroke != null) {
    styleProperties.push('stroke');
  }
  if (strokeWidth != null) {
    styleProperties.push('strokeWidth');
  }
  if (strokeOpacity != null) {
    styleProperties.push('strokeOpacity');
  }
  if (strokeDasharray != null) {
    styleProperties.push('strokeDasharray');
  }
  if (strokeDashoffset != null) {
    styleProperties.push('strokeDashoffset');
  }
  if (strokeLinecap != null) {
    styleProperties.push('strokeLinecap');
  }
  if (strokeLinejoin != null) {
    styleProperties.push('strokeLinejoin');
  }
  if (strokeMiterlimit != null) {
    styleProperties.push('strokeMiterlimit');
  }

  const strokeDash =
    !strokeDasharray || strokeDasharray === 'none'
      ? null
      : extractLengthList(strokeDasharray);

  return {
    stroke: extractBrush(stroke),
    strokeOpacity: extractOpacity(strokeOpacity),
    strokeLinecap: (strokeLinecap && caps[strokeLinecap]) || 0,
    strokeLinejoin: (strokeLinejoin && joins[strokeLinejoin]) || 0,
    strokeDasharray:
      strokeDash && strokeDash.length % 2 === 1
        ? strokeDash.concat(strokeDash)
        : strokeDash,
    strokeWidth: strokeWidth != null ? strokeWidth : 1,
    strokeDashoffset:
      strokeDasharray && strokeDashoffset ? +strokeDashoffset || 0 : null,
    strokeMiterlimit:
      (strokeMiterlimit && typeof strokeMiterlimit !== 'number'
        ? parseFloat(strokeMiterlimit)
        : strokeMiterlimit) || 4,
    vectorEffect: (vectorEffect && vectorEffects[vectorEffect]) || 0,
  };
}

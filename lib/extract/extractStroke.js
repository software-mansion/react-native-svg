import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import extractLengthList from './extractLengthList';

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
  uri: 3
};

export default function extractStroke(props, styleProperties) {
  if (props.stroke != null) {
    styleProperties.push('stroke');
  }
  if (props.strokeWidth != null) {
    styleProperties.push('strokeWidth');
  }
  if (props.strokeOpacity != null) {
    styleProperties.push('strokeOpacity');
  }
  if (props.strokeDasharray != null) {
    styleProperties.push('strokeDasharray');
  }
  if (props.strokeDashoffset != null) {
    styleProperties.push('strokeDashoffset');
  }
  if (props.strokeLinecap != null) {
    styleProperties.push('strokeLinecap');
  }
  if (props.strokeLinejoin != null) {
    styleProperties.push('strokeLinejoin');
  }
  if (props.strokeMiterlimit != null) {
    styleProperties.push('strokeMiterlimit');
  }

  const { stroke, strokeWidth = 1, strokeDasharray } = props;
  const strokeDash =
    !strokeDasharray || strokeDasharray === 'none'
      ? null
      : extractLengthList(strokeDasharray);

  return {
    stroke: extractBrush(stroke),
    strokeOpacity: extractOpacity(props.strokeOpacity),
    strokeLinecap: caps[props.strokeLinecap] || 0,
    strokeLinejoin: joins[props.strokeLinejoin] || 0,
    strokeDasharray:
      strokeDash && strokeDash.length % 2 === 1
        ? strokeDash.concat(strokeDash)
        : strokeDash,
    strokeWidth,
    strokeDashoffset: strokeDasharray ? +props.strokeDashoffset || 0 : null,
    strokeMiterlimit: parseFloat(props.strokeMiterlimit) || 4,
    vectorEffect: vectorEffects[props.vectorEffect] || 0,
  };
}

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

const strokeProps = [
  'stroke',
  'strokeWidth',
  'strokeOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeLinecap',
  'strokeLinejoin',
  'strokeMiterlimit',
];
const numStrokeProps = strokeProps.length;

export default function extractStroke(props, styleProperties) {
  for (let i = 0; i < numStrokeProps; i++) {
    const name = strokeProps[i];
    if (props.hasOwnProperty(name)) {
      styleProperties.push(name);
    }
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
  };
}

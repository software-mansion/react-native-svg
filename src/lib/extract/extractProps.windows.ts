import extractFill from './extractFill';
import extractStroke from './extractStroke';
import extractTransform from './extractTransform';
import extractResponder from './extractResponder';
import extractOpacity from './extractOpacity';
import { idPattern } from '../util';
import type {
  ClipProps,
  extractedProps,
  FillProps,
  NumberProp,
  ResponderProps,
  StrokeProps,
  TransformProps,
} from './types';

const clipRules: { evenodd: number; nonzero: number } = {
  evenodd: 0,
  nonzero: 1,
};

export function propsAndStyles(props: object & { style?: [] | unknown }) {
  const { style } = props;
  return !style
    ? props
    : {
        ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
        ...props,
      };
}

function getMarker(marker?: string) {
  if (!marker) {
    return undefined;
  }
  const matched = marker.match(idPattern);
  return matched ? matched[1] : undefined;
}

export default function extractProps(
  props: {
    id?: string;
    mask?: string;
    marker?: string;
    markerStart?: string;
    markerMid?: string;
    markerEnd?: string;
    clipPath?: string;
    display?: string;
    opacity?: NumberProp;
    onLayout?: () => void;
  } & TransformProps &
    ResponderProps &
    StrokeProps &
    FillProps &
    ClipProps,
  ref: object
) {
  const {
    id,
    opacity,
    onLayout,
    clipPath,
    clipRule,
    display,
    mask,
    marker,
    markerStart = marker,
    markerMid = marker,
    markerEnd = marker,
  } = props;
  const extracted: extractedProps = {};

  const inherited: string[] = [];
  extractResponder(extracted, props, ref);
  extractFill(extracted, props, inherited);
  extractStroke(extracted, props, inherited);

  if (inherited.length) {
    extracted.propList = inherited;
  }

  const matrix = extractTransform(props);
  if (matrix !== null) {
    extracted.matrix = matrix;
  }

  if (opacity != null) {
    extracted.opacity = extractOpacity(opacity);
  }

  if (display != null) {
    extracted.display = display === 'none' ? 'none' : undefined;
  }

  if (onLayout) {
    extracted.onLayout = onLayout;
  }

  if (markerStart) {
    extracted.markerStart = getMarker(markerStart);
  }
  if (markerMid) {
    extracted.markerMid = getMarker(markerMid);
  }
  if (markerEnd) {
    extracted.markerEnd = getMarker(markerEnd);
  }

  if (id) {
    extracted.name = String(id);
  }

  if (clipRule) {
    extracted.clipRule = clipRules[clipRule] === 0 ? 0 : 1;
  }
  if (clipPath) {
    const matched = clipPath.match(idPattern);
    if (matched) {
      extracted.clipPath = matched[1];
    } else {
      console.warn(
        'Invalid `clipPath` prop, expected a clipPath like "#id", but got: "' +
          clipPath +
          '"'
      );
    }
  }

  if (mask) {
    const matched = mask.match(idPattern);

    if (matched) {
      extracted.mask = matched[1];
    } else {
      console.warn(
        'Invalid `mask` prop, expected a mask like "#id", but got: "' +
          mask +
          '"'
      );
    }
  }

  return extracted;
}

export function extract(
  instance: object,
  props: object & { style?: [] | unknown }
) {
  return extractProps(propsAndStyles(props), instance);
}

export function stringifyPropsForFabric(props: {
  [key: string]: NumberProp | undefined | null;
}) {
  const extracted: { [key: string]: NumberProp } = {};
  Object.keys(props).forEach((k) => {
    const prop = props[k];
    if (prop !== undefined && prop !== null) {
      const propStr = prop as string;
      const propNum = parseInt(propStr, 10);
      const doNotParse = isNaN(propNum) || propStr[propStr.length - 1] === '%';
      extracted[k] = doNotParse ? propStr : propNum;
    }
  });

  return extracted;
}

export function withoutXY(
  instance: object,
  props: object & { style?: [] | unknown }
) {
  return extractProps({ ...propsAndStyles(props), x: null, y: null }, instance);
}

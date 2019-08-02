import extractFill from './extractFill';
import extractStroke from './extractStroke';
import { transformToMatrix, props2transform } from './extractTransform';
import extractClipPath from './extractClipPath';
import extractResponder from './extractResponder';
import extractOpacity from './extractOpacity';
import { idPattern } from '../util';

export function propsAndStyles(props) {
  const { style } = props;
  return {
    ...(style && style.length ? Object.assign({}, ...style) : style),
    ...props,
  };
}

export default function extractProps(props, ref) {
  const { opacity, onLayout, id, clipPath, mask, transform } = props;
  const styleProperties = [];
  const transformProps = props2transform(props);
  const matrix = transformToMatrix(transformProps, transform);
  const extracted = {
    matrix,
    onLayout,
    ...transformProps,
    propList: styleProperties,
    opacity: extractOpacity(opacity),
    ...extractResponder(props, ref),
    ...extractFill(props, styleProperties),
    ...extractStroke(props, styleProperties),
  };

  if (id) {
    extracted.name = id;
  }

  if (clipPath) {
    Object.assign(extracted, extractClipPath(props));
  }

  if (mask) {
    const matched = mask.match(idPattern);

    if (matched) {
      extracted.mask = matched[1];
    } else {
      console.warn(
        'Invalid `mask` prop, expected a mask like "#id", but got: "' +
          mask +
          '"',
      );
    }
  }

  return extracted;
}

import extractFill from './extractFill';
import extractStroke from './extractStroke';
import { transformToMatrix, props2transform } from './extractTransform';
import extractClipPath from './extractClipPath';
import extractResponder from './extractResponder';
import extractOpacity from './extractOpacity';
import { idPattern } from '../util';

export function propsAndStyles(props) {
  const style = props.style;
  return {
    ...(style && style.length ? Object.assign({}, ...style) : style),
    ...props,
  };
}

export default function extractProps(props, ref) {
  const { opacity, onLayout, id, clipPath, mask } = props;
  const styleProperties = [];
  const transformProps = props2transform(props);
  const matrix = transformToMatrix(transformProps, props.transform);
  const extractedProps = {
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
    extractedProps.name = id;
  }

  if (clipPath) {
    Object.assign(extractedProps, extractClipPath(props));
  }

  if (mask) {
    const matched = mask.match(idPattern);

    if (matched) {
      extractedProps.mask = matched[1];
    } else {
      console.warn(
        'Invalid `mask` prop, expected a mask like "#id", but got: "' +
          mask +
          '"',
      );
    }
  }

  return extractedProps;
}

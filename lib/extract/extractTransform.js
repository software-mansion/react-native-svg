import Matrix2D, { identity } from '../Matrix2D';
import transformParser from './transform';

const pooledMatrix = new Matrix2D();

function appendTransform(props) {
  pooledMatrix.appendTransform(
    props.x + props.originX,
    props.y + props.originY,
    props.scaleX,
    props.scaleY,
    props.rotation,
    props.skewX,
    props.skewY,
    props.originX,
    props.originY,
  );
}

function universal2axis(universal, axisX, axisY, defaultValue) {
  let x;
  let y;
  if (typeof universal === 'number') {
    x = y = universal;
  } else if (typeof universal === 'string') {
    const coords = universal.split(/\s*,\s*/);
    if (coords.length === 2) {
      x = +coords[0];
      y = +coords[1];
    } else if (coords.length === 1) {
      x = y = +coords[0];
    }
  }

  axisX = +axisX;
  if (!isNaN(axisX)) {
    x = axisX;
  }

  axisY = +axisY;
  if (!isNaN(axisY)) {
    y = axisY;
  }

  return [x || defaultValue || 0, y || defaultValue || 0];
}

export function props2transform(props) {
  const origin = universal2axis(props.origin, props.originX, props.originY);
  const scale = universal2axis(props.scale, props.scaleX, props.scaleY, 1);
  const skew = universal2axis(props.skew, props.skewX, props.skewY);
  const translate = universal2axis(
    props.translate,
    props.translateX == null ? props.x || 0 : props.translateX,
    props.translateY == null ? props.y || 0 : props.translateY,
  );

  return {
    rotation: +props.rotation || 0,
    scaleX: scale[0],
    scaleY: scale[1],
    originX: origin[0],
    originY: origin[1],
    skewX: skew[0],
    skewY: skew[1],
    x: translate[0],
    y: translate[1],
  };
}

export function transformToMatrix(props, transform) {
  pooledMatrix.reset();
  appendTransform(props);

  if (transform) {
    if (Array.isArray(transform)) {
      if (typeof transform[0] === 'number') {
        pooledMatrix.append(
          transform[0],
          transform[1],
          transform[2],
          transform[3],
          transform[4],
          transform[5],
        );
      }
      // noop for react-native transform arrays, let animated handle them
    } else if (typeof transform === 'string') {
      try {
        const t = transformParser.parse(transform);
        pooledMatrix.append(t[0], t[3], t[1], t[4], t[2], t[5]);
      } catch (e) {
        console.error(e);
      }
    } else {
      appendTransform(props2transform(transform));
    }
  }

  return pooledMatrix.toArray();
}

export default function extractTransform(props) {
  if (Array.isArray(props)) {
    return props;
  }
  if (typeof props === 'string') {
    try {
      const t = transformParser.parse(props);
      return [t[0], t[3], t[1], t[4], t[2], t[5]];
    } catch (e) {
      console.error(e);
      return identity;
    }
  }
  return transformToMatrix(props2transform(props), props.transform);
}

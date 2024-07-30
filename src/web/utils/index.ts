import { BaseProps } from '../types';
import type { TransformProps } from '../../lib/extract/types';
import {
  transformsArrayToProps,
  TransformsStyleArray,
} from '../../lib/extract/extractTransform';

export const hasTouchableProperty = (props: BaseProps) =>
  props.onPress || props.onPressIn || props.onPressOut || props.onLongPress;

export const camelCaseToDashed = (camelCase: string) => {
  return camelCase.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
};

function stringifyTransformProps(transformProps: TransformProps) {
  const transformArray = [];
  if (transformProps.translate != null) {
    transformArray.push(`translate(${transformProps.translate})`);
  }
  if (transformProps.translateX != null || transformProps.translateY != null) {
    transformArray.push(
      `translate(${transformProps.translateX || 0}, ${
        transformProps.translateY || 0
      })`
    );
  }
  if (transformProps.scale != null) {
    transformArray.push(`scale(${transformProps.scale})`);
  }
  if (transformProps.scaleX != null || transformProps.scaleY != null) {
    transformArray.push(
      `scale(${transformProps.scaleX || 1}, ${transformProps.scaleY || 1})`
    );
  }
  // rotation maps to rotate, not to collide with the text rotate attribute (which acts per glyph rather than block)
  if (transformProps.rotation != null) {
    transformArray.push(`rotate(${transformProps.rotation})`);
  }
  if (transformProps.skewX != null) {
    transformArray.push(`skewX(${transformProps.skewX})`);
  }
  if (transformProps.skewY != null) {
    transformArray.push(`skewY(${transformProps.skewY})`);
  }
  return transformArray;
}

export function parseTransformProp(
  transform: TransformProps['transform'],
  props?: BaseProps
) {
  const transformArray: string[] = [];

  props && transformArray.push(...stringifyTransformProps(props));

  if (Array.isArray(transform)) {
    if (typeof transform[0] === 'number') {
      transformArray.push(`matrix(${transform.join(' ')})`);
    } else {
      const stringifiedProps = transformsArrayToProps(
        transform as TransformsStyleArray
      );
      transformArray.push(...stringifyTransformProps(stringifiedProps));
    }
  } else if (typeof transform === 'string') {
    transformArray.push(transform);
  }

  return transformArray.length ? transformArray.join(' ') : undefined;
}

export const getBoundingClientRect = (node: SVGElement) => {
  if (node) {
    const isElement = node.nodeType === 1; /* Node.ELEMENT_NODE */
    if (isElement && typeof node.getBoundingClientRect === 'function') {
      return node.getBoundingClientRect();
    }
  }
  throw new Error('Can not get boundingClientRect of ' + node || 'undefined');
};

const measureLayout = (
  node: SVGElement,
  callback: (
    x: number,
    y: number,
    width: number,
    height: number,
    left: number,
    top: number
  ) => void
) => {
  const relativeNode = node?.parentNode;
  if (relativeNode) {
    setTimeout(() => {
      // @ts-expect-error TODO: handle it better
      const relativeRect = getBoundingClientRect(relativeNode);
      const { height, left, top, width } = getBoundingClientRect(node);
      const x = left - relativeRect.left;
      const y = top - relativeRect.top;
      callback(x, y, width, height, left, top);
    }, 0);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function remeasure(this: any) {
  const tag = this.state.touchable.responderID;
  if (tag === null) {
    return;
  }
  measureLayout(tag, this._handleQueryLayout);
}

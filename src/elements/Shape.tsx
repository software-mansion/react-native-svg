import { Component } from 'react';
import SvgTouchableMixin from '../lib/SvgTouchableMixin';
import {
  NativeModules,
  findNodeHandle,
  NativeMethodsMixinStatic,
} from 'react-native';
import { TransformProps } from '../lib/extract/types';

const RNSVGRenderableManager = NativeModules.RNSVGRenderableManager;
const { touchableGetInitialState } = SvgTouchableMixin;
const touchKeys = Object.keys(SvgTouchableMixin);
const touchVals = touchKeys.map(key => SvgTouchableMixin[key]);
const numTouchKeys = touchKeys.length;

interface SVGBoundingBoxOptions {
  fill?: boolean;
  stroke?: boolean;
  markers?: boolean;
  clipped?: boolean;
}

interface DOMPointInit {
  x?: number;
  y?: number;
  z?: number;
  w?: number;
}

export default class Shape<P> extends Component<P> {
  [x: string]: unknown;
  root: (Shape<P> & NativeMethodsMixinStatic) | null = null;
  constructor(props: P, context: {}) {
    super(props, context);
    for (let i = 0; i < numTouchKeys; i++) {
      const key = touchKeys[i];
      const val = touchVals[i];
      if (typeof val === 'function') {
        this[key] = val.bind(this);
      } else {
        this[key] = val;
      }
    }
    this.state = touchableGetInitialState();
  }
  refMethod: (
    instance: (Shape<P> & NativeMethodsMixinStatic) | null,
  ) => void = (instance: (Shape<P> & NativeMethodsMixinStatic) | null) => {
    this.root = instance;
  };
  setNativeProps = (
    props: Object & {
      matrix?: [number, number, number, number, number, number];
    } & TransformProps,
  ) => {
    this.root && this.root.setNativeProps(props);
  };
  getBBox = (callback?: () => void, options?: SVGBoundingBoxOptions) => {
    const { fill = true, stroke = true, markers = true, clipped = true } =
      options || {};
    const handle = findNodeHandle(this.root as Component);
    if (!callback) {
      return new Promise(resolve => {
        RNSVGRenderableManager.getBBox(
          handle,
          {
            fill,
            stroke,
            markers,
            clipped,
          },
          resolve,
        );
      });
    }
    RNSVGRenderableManager.getBBox(
      handle,
      {
        fill,
        stroke,
        markers,
        clipped,
      },
      callback,
    );
    return undefined;
  };
  getCTM = (callback: () => void) => {
    const handle = findNodeHandle(this.root as Component);
    if (!callback) {
      return new Promise(resolve => {
        RNSVGRenderableManager.getCTM(handle, resolve);
      });
    }
    RNSVGRenderableManager.getCTM(handle, callback);
    return undefined;
  };
  getScreenCTM = (callback: () => void) => {
    const handle = findNodeHandle(this.root as Component);
    if (!callback) {
      return new Promise(resolve => {
        RNSVGRenderableManager.getScreenCTM(handle, resolve);
      });
    }
    RNSVGRenderableManager.getScreenCTM(handle, callback);
    return undefined;
  };
  isPointInFill = (options: DOMPointInit, callback: () => void) => {
    const handle = findNodeHandle(this.root as Component);
    if (!callback) {
      return new Promise(resolve => {
        RNSVGRenderableManager.isPointInFill(handle, options, resolve);
      });
    }
    RNSVGRenderableManager.isPointInFill(handle, options, callback);
    return undefined;
  };
  isPointInStroke = (options: DOMPointInit, callback?: () => void) => {
    const handle = findNodeHandle(this.root as Component);
    if (!callback) {
      return new Promise(resolve => {
        RNSVGRenderableManager.isPointInStroke(handle, options, resolve);
      });
    }
    RNSVGRenderableManager.isPointInStroke(handle, options, callback);
    return undefined;
  };
  getTotalLength = (callback?: () => void) => {
    const handle = findNodeHandle(this.root as Component);
    if (!callback) {
      return new Promise(resolve => {
        RNSVGRenderableManager.getTotalLength(handle, resolve);
      });
    }
    RNSVGRenderableManager.getTotalLength(handle, callback);
    return undefined;
  };
  getPointAtLength = (length: number, callback: () => void) => {
    const handle = findNodeHandle(this.root as Component);
    if (!callback) {
      return new Promise(resolve => {
        RNSVGRenderableManager.getPointAtLength(handle, { length }, resolve);
      });
    }
    RNSVGRenderableManager.getPointAtLength(handle, { length }, callback);
    return undefined;
  };
}

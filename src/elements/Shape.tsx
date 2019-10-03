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
  fill: boolean;
  stroke: boolean;
  markers: boolean;
  clipped: boolean;
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
  getBBox = (callback: () => void, options?: SVGBoundingBoxOptions) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    RNSVGRenderableManager.getBBox(handle, options, callback); // TODO
  };
  getCTM = (callback: () => void) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    RNSVGRenderableManager.getCTM(handle, callback); // TODO
  };
  getScreenCTM = (callback: () => void) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    RNSVGRenderableManager.getScreenCTM(handle, callback); // TODO
  };
  isPointInFill = (callback: () => void, options: DOMPointInit) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    RNSVGRenderableManager.isPointInFill(handle, options, callback);
  };
  isPointInStroke = (callback: () => void, options: DOMPointInit) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    RNSVGRenderableManager.isPointInStroke(handle, options, callback); // TODO
  };
  getTotalLength = (callback: () => void) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    RNSVGRenderableManager.getTotalLength(handle, callback); // TODO
  };
  getPointAtLength = (callback: () => void, options: Object) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    RNSVGRenderableManager.getPointAtLength(handle, options, callback); // TODO
  };
}

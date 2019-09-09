import { Component } from 'react';
import SvgTouchableMixin from '../lib/SvgTouchableMixin';
import { NativeMethodsMixinStatic } from 'react-native';
import { TransformProps } from '../lib/extract/types';

const { touchableGetInitialState } = SvgTouchableMixin;
const touchKeys = Object.keys(SvgTouchableMixin);
const touchVals = touchKeys.map(key => SvgTouchableMixin[key]);
const numTouchKeys = touchKeys.length;

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
}

import { Component } from 'react';
import { NativeMethods } from 'react-native';
import { NumberProp } from '../../lib/extract/types';

export interface FilterPrimitiveCommonProps {
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  result?: string;
}

export default class FilterPrimitive<P> extends Component<
  P & FilterPrimitiveCommonProps
> {
  [x: string]: unknown;
  root: (FilterPrimitive<P> & NativeMethods) | null = null;

  static defaultPrimitiveProps: React.ComponentProps<typeof FilterPrimitive> =
    {};

  refMethod: (instance: (FilterPrimitive<P> & NativeMethods) | null) => void = (
    instance: (FilterPrimitive<P> & NativeMethods) | null
  ) => {
    this.root = instance;
  };

  setNativeProps = (props: P) => {
    this.root?.setNativeProps(props);
  };
}

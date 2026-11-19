import { Component } from 'react';
import { HostInstance } from 'react-native';
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
  root: (FilterPrimitive<P> & HostInstance) | null = null;

  static defaultPrimitiveProps: React.ComponentProps<typeof FilterPrimitive> =
    {};

  refMethod: (instance: (FilterPrimitive<P> & HostInstance) | null) => void = (
    instance: (FilterPrimitive<P> & HostInstance) | null
  ) => {
    this.root = instance;
  };

  setNativeProps = (props: P) => {
    this.root?.setNativeProps(props);
  };
}

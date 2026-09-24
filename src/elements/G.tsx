import type { ReactNode } from 'react';
import * as React from 'react';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import { extractFont } from '../lib/extract/extractText';
import extractTransform, {
  extractTransformSvgView,
} from '../lib/extract/extractTransform';
import type {
  CommonPathProps,
  FontProps,
  NumberProp,
} from '../lib/extract/types';
import Shape from './Shape';
import RNSVGGroup from '../fabric/GroupNativeComponent';
import type { NativeMethods } from 'react-native';

export interface GProps extends CommonPathProps, FontProps {
  children?: ReactNode;
  opacity?: NumberProp;
}

export default class G<P> extends Shape<GProps & P> {
  static displayName = 'G';

  setNativeProps = (
    props: GProps &
      P & {
        matrix?: number[];
      }
  ) => {
    const matrix = !props.matrix && extractTransform(props);
    if (matrix) {
      props.matrix = matrix;
    }
    this.root?.setNativeProps(props);
  };

  render() {
    const { props } = this;
    const prop = propsAndStyles(props);
    const extractedProps = extractProps(prop, this);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transform = extractTransformSvgView(props as any);

    const font = extractFont(prop);
    if (hasProps(font)) {
      extractedProps.font = font;
    }

    return (
      <RNSVGGroup
        ref={(ref) => this.refMethod(ref as (G<P> & NativeMethods) | null)}
        {...extractedProps}
        style={{ transform }}>
        {props.children}
      </RNSVGGroup>
    );
  }
}

const hasProps = (obj: object) => {
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in obj) {
    return true;
  }
  return false;
};

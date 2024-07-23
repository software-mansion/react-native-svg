import type { Component } from 'react';
import * as React from 'react';
import type {
  ColorValue,
  MeasureInWindowOnSuccessCallback,
  MeasureLayoutOnSuccessCallback,
  MeasureOnSuccessCallback,
  NativeMethods,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { findNodeHandle, Platform, StyleSheet } from 'react-native';
import type {
  extractedProps,
  NumberProp,
  ResponderInstanceProps,
} from '../lib/extract/types';
import extractResponder from '../lib/extract/extractResponder';
import extractViewBox from '../lib/extract/extractViewBox';
import Shape from './Shape';
import type { GProps } from './G';
import G from './G';
import RNSVGSvgAndroid from '../fabric/AndroidSvgViewNativeComponent';
import RNSVGSvgIOS from '../fabric/IOSSvgViewNativeComponent';
import type { Spec } from '../fabric/NativeSvgViewModule';
import extractOpacity from '../lib/extract/extractOpacity';

const styles = StyleSheet.create({
  svg: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});
const defaultStyle = styles.svg;

export interface SvgProps extends GProps, ViewProps {
  width?: NumberProp;
  height?: NumberProp;
  viewBox?: string;
  preserveAspectRatio?: string;
  color?: ColorValue;
  title?: string;
}

export default class Svg extends Shape<SvgProps> {
  static displayName = 'Svg';

  static defaultProps = {
    preserveAspectRatio: 'xMidYMid meet',
  };

  measureInWindow = (callback: MeasureInWindowOnSuccessCallback) => {
    const { root } = this;
    root && root.measureInWindow(callback);
  };

  measure = (callback: MeasureOnSuccessCallback) => {
    const { root } = this;
    root && root.measure(callback);
  };

  measureLayout = (
    relativeToNativeNode: number,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail: () => void /* currently unused */
  ) => {
    const { root } = this;
    root && root.measureLayout(relativeToNativeNode, onSuccess, onFail);
  };

  setNativeProps = (
    props: SvgProps & {
      bbWidth?: NumberProp;
      bbHeight?: NumberProp;
    }
  ) => {
    const { root } = this;
    root && root.setNativeProps(props);
  };

  toDataURL = (callback: (base64: string) => void, options?: object) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    const RNSVGSvgViewModule: Spec =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../fabric/NativeSvgViewModule').default;
    RNSVGSvgViewModule.toDataURL(handle, options, callback);
  };

  render() {
    const {
      style,
      opacity,
      viewBox,
      children,
      onLayout,
      preserveAspectRatio,
      ...extracted
    } = this.props;
    const stylesAndProps = {
      ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
      ...extracted,
    };
    let {
      color,
      width,
      height,
      focusable,
      transform,

      // Inherited G properties
      font,
      fill,
      fillOpacity,
      fillRule,
      stroke,
      strokeWidth,
      strokeOpacity,
      strokeDasharray,
      strokeDashoffset,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
    } = stylesAndProps;
    if (width === undefined && height === undefined) {
      width = height = '100%';
    }

    const props: extractedProps = extracted as extractedProps;
    props.focusable = Boolean(focusable) && focusable !== 'false';
    const rootStyles: StyleProp<ViewStyle>[] = [defaultStyle];

    if (style) {
      rootStyles.push(style);
    }

    let override = false;
    const overrideStyles: ViewStyle = {};
    const o = opacity != null ? extractOpacity(opacity) : NaN;
    if (!isNaN(o)) {
      override = true;
      overrideStyles.opacity = o;
    }

    if (width && height) {
      override = true;
      const w = parseInt(width, 10);
      const h = parseInt(height, 10);
      const doNotParseWidth = isNaN(w) || width[width.length - 1] === '%';
      const doNotParseHeight = isNaN(h) || height[height.length - 1] === '%';
      overrideStyles.width = doNotParseWidth ? width : w;
      overrideStyles.height = doNotParseHeight ? height : h;
      overrideStyles.flex = 0;
    }

    if (override) {
      rootStyles.push(overrideStyles);
    }

    props.style = rootStyles.length > 1 ? rootStyles : defaultStyle;

    if (width != null) {
      props.bbWidth = width;
    }
    if (height != null) {
      props.bbHeight = height;
    }

    extractResponder(props, props, this as ResponderInstanceProps);

    props.tintColor = color;

    if (onLayout != null) {
      props.onLayout = onLayout;
    }

    const gStyle = Object.assign({}, StyleSheet.flatten(style));
    // if transform prop is of RN style's kind, we want `SvgView` to handle it
    // since it can be done here. Otherwise, if transform is of `svg` kind, e.g. string,
    // we want G element to parse it since `Svg` does not include parsing of those custom transforms.
    // It is problematic due to fact that we either move the `Svg` or just its `G` child, and in the
    // second case, when the `G` leaves the area of `Svg`, it will just disappear.
    if (Array.isArray(transform) && typeof transform[0] === 'object') {
      gStyle.transform = undefined;
    } else {
      props.transform = undefined;
      gStyle.transform = transform;
    }

    const RNSVGSvg = Platform.OS === 'android' ? RNSVGSvgAndroid : RNSVGSvgIOS;

    return (
      <RNSVGSvg
        {...props}
        ref={(ref) => this.refMethod(ref as (Svg & NativeMethods) | null)}
        {...extractViewBox({ viewBox, preserveAspectRatio })}>
        <G
          {...{
            children,
            style: gStyle,
            font,
            fill,
            fillOpacity,
            fillRule,
            stroke,
            strokeWidth,
            strokeOpacity,
            strokeDasharray,
            strokeDashoffset,
            strokeLinecap,
            strokeLinejoin,
            strokeMiterlimit,
          }}
        />
      </RNSVGSvg>
    );
  }
}

import React, { Component } from 'react';
import {
  requireNativeComponent,
  StyleSheet,
  findNodeHandle,
  NativeModules,
  MeasureOnSuccessCallback,
  MeasureLayoutOnSuccessCallback,
  MeasureInWindowOnSuccessCallback,
} from 'react-native';
import {
  ClipProps,
  FillProps,
  NumberProp,
  StrokeProps,
  ResponderProps,
  TransformProps,
  ResponderInstanceProps,
} from '../lib/extract/types';
import extractResponder from '../lib/extract/extractResponder';
import extractViewBox from '../lib/extract/extractViewBox';
import Shape from './Shape';
import G from './G';

const RNSVGSvgViewManager = NativeModules.RNSVGSvgViewManager;

const styles = StyleSheet.create({
  svg: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});

export default class Svg extends Shape<
  {
    style?: [] | {};
    viewBox?: string;
    opacity?: NumberProp;
    onLayout?: () => void;
    preserveAspectRatio?: string;
  } & TransformProps &
    ResponderProps &
    StrokeProps &
    FillProps &
    ClipProps
> {
  static displayName = 'Svg';

  static defaultProps = {
    preserveAspectRatio: 'xMidYMid meet',
  };

  measureInWindow = (callback: MeasureInWindowOnSuccessCallback) => {
    this.root && this.root.measureInWindow(callback);
  };

  measure = (callback: MeasureOnSuccessCallback) => {
    this.root && this.root.measure(callback);
  };

  measureLayout = (
    relativeToNativeNode: number,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail: () => void /* currently unused */,
  ) => {
    this.root &&
      this.root.measureLayout(relativeToNativeNode, onSuccess, onFail);
  };

  setNativeProps = (
    props: Object & {
      width?: NumberProp;
      height?: NumberProp;
      bbWidth?: NumberProp;
      bbHeight?: NumberProp;
    },
  ) => {
    const { width, height } = props;
    if (width) {
      props.bbWidth = width;
    }
    if (height) {
      props.bbHeight = height;
    }
    this.root && this.root.setNativeProps(props);
  };

  toDataURL = (callback: () => void, options: Object) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root as Component);
    RNSVGSvgViewManager.toDataURL(handle, options, callback);
  };

  render() {
    const {
      opacity = 1,
      viewBox,
      preserveAspectRatio,
      style,
      children,
      onLayout,
      ...props
    } = this.props;
    const stylesAndProps = {
      ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
      ...props,
    };
    const {
      color,
      width,
      height,

      // Inherited G properties
      font,
      transform,
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

    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    const doNotParseWidth = isNaN(w) || width[width.length - 1] === '%';
    const doNotParseHeight = isNaN(h) || height[height.length - 1] === '%';
    const dimensions =
      width && height
        ? {
            width: doNotParseWidth ? width : w,
            height: doNotParseHeight ? height : h,
            flex: 0,
          }
        : null;

    const o = +opacity;
    const opacityStyle = !isNaN(o)
      ? {
          opacity: o,
        }
      : null;

    return (
      <RNSVGSvg
        {...props}
        bbWidth={width}
        bbHeight={height}
        tintColor={color}
        onLayout={onLayout}
        ref={this.refMethod}
        style={[styles.svg, style, opacityStyle, dimensions]}
        {...extractResponder(props, this as ResponderInstanceProps)}
        {...extractViewBox({ viewBox, preserveAspectRatio })}
      >
        <G
          {...{
            children,
            style,
            font,
            transform,
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

export const RNSVGSvg = requireNativeComponent('RNSVGSvgView');

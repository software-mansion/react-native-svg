import React from 'react';
import {
  requireNativeComponent,
  StyleSheet,
  findNodeHandle,
  NativeModules,
} from 'react-native';
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

export default class Svg extends Shape {
  static displayName = 'Svg';

  static defaultProps = {
    preserveAspectRatio: 'xMidYMid meet',
  };

  measureInWindow = (...args) => {
    this.root.measureInWindow(...args);
  };

  measure = (...args) => {
    this.root.measure(...args);
  };

  measureLayout = (...args) => {
    this.root.measureLayout(...args);
  };

  setNativeProps = props => {
    const { width, height } = props;
    if (width) {
      props.bbWidth = width;
    }
    if (height) {
      props.bbHeight = height;
    }
    this.root.setNativeProps(props);
  };

  toDataURL = (callback, options) => {
    if (!callback) {
      return;
    }
    const handle = findNodeHandle(this.root);
    RNSVGSvgViewManager.toDataURL(handle, options, callback);
  };

  render() {
    const {
      opacity,
      viewBox,
      preserveAspectRatio,
      style,
      children,
      onLayout,
      ...props
    } = this.props;
    const stylesAndProps = {
      ...(style && style.length ? Object.assign({}, ...style) : style),
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
      <NativeSvgView
        {...props}
        bbWidth={width}
        bbHeight={height}
        tintColor={color}
        onLayout={onLayout}
        ref={this.refMethod}
        style={[styles.svg, style, opacityStyle, dimensions]}
        {...extractResponder(props, this)}
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
      </NativeSvgView>
    );
  }
}

const NativeSvgView = requireNativeComponent('RNSVGSvgView');

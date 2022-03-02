import React from 'react';
import extractViewBox from '../lib/extract/extractViewBox';
import Shape from './Shape';
import { RNSVGMarker } from './NativeComponents';
import { MarkerProps } from './types';

export default class Marker extends Shape<MarkerProps> {
  static displayName = 'Marker';

  static defaultProps = {
    refX: 0,
    refY: 0,
    orient: '0',
    markerWidth: 3,
    markerHeight: 3,
    markerUnits: 'strokeWidth',
  };

  render() {
    const { props } = this;
    const {
      id,
      viewBox,
      preserveAspectRatio,
      refX,
      refY,
      markerUnits,
      orient,
      markerWidth,
      markerHeight,
      children,
    } = props;
    const markerProps = {
      name: id,
      refX,
      refY,
      markerUnits,
      orient: String(orient),
      markerWidth,
      markerHeight,
    };

    return (
      <RNSVGMarker
        ref={this.refMethod}
        {...markerProps}
        {...extractViewBox({ viewBox, preserveAspectRatio })}
      >
        {children}
      </RNSVGMarker>
    );
  }
}

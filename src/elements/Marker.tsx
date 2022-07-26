import React, { ReactNode } from 'react';
import extractViewBox from '../lib/extract/extractViewBox';
import { NumberProp } from '../lib/extract/types';
import Shape from './Shape';
import { RNSVGMarker } from './NativeComponents';

export enum MarkerUnits {
  STROKE_WIDTH = 'strokeWidth',
  USER_SPACE_ON_USE = 'userSpaceOnUse',
}

export enum Orient {
  AUTO = 'auto',
  AUTO_START_REVERSE = 'auto-start-reverse',
}

export interface MarkerProps {
  children?: ReactNode;
  id?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
  refX?: NumberProp;
  refY?: NumberProp;
  markerWidth?: NumberProp;
  markerHeight?: NumberProp;
  markerUnits?: MarkerUnits;
  orient?: Orient | NumberProp;
}

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

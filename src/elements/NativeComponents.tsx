import { requireNativeComponent as rnc } from 'react-native';
import React from 'react';

declare module 'react-native' {
  function requireNativeComponent(
    viewName: string,
  ): // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<React.PropsWithChildren<any>>;
}

export const RNSVGSvg = rnc('RNSVGSvgView');
export const RNSVGCircle = rnc('RNSVGCircle');
export const RNSVGClipPath = rnc('RNSVGClipPath');
export const RNSVGDefs = rnc('RNSVGDefs');
export const RNSVGEllipse = rnc('RNSVGEllipse');
export const RNSVGForeignObject = rnc('RNSVGForeignObject');
export const RNSVGGroup = rnc('RNSVGGroup');
export const RNSVGImage = rnc('RNSVGImage');
export const RNSVGLine = rnc('RNSVGLine');
export const RNSVGLinearGradient = rnc('RNSVGLinearGradient');
export const RNSVGMarker = rnc('RNSVGMarker');
export const RNSVGMask = rnc('RNSVGMask');
export const RNSVGPath = rnc('RNSVGPath');
export const RNSVGPattern = rnc('RNSVGPattern');
export const RNSVGRadialGradient = rnc('RNSVGRadialGradient');
export const RNSVGRect = rnc('RNSVGRect');
export const RNSVGSymbol = rnc('RNSVGSymbol');
export const RNSVGText = rnc('RNSVGText');
export const RNSVGTextPath = rnc('RNSVGTextPath');
export const RNSVGTSpan = rnc('RNSVGTSpan');
export const RNSVGUse = rnc('RNSVGUse');

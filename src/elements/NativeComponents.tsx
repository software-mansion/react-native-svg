import { requireNativeComponent as rnc } from 'react-native';

// @ts-expect-error nativeFabricUIManager is not yet included in the RN types
const ENABLE_FABRIC = !!global?.nativeFabricUIManager;

const FabricComponents = ENABLE_FABRIC ? require('../fabric') : {};

export const RNSVGSvg = ENABLE_FABRIC ? FabricComponents.SvgView : rnc('RNSVGSvgView');
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

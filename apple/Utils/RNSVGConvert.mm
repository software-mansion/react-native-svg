#import "RNSVGConvert.h"

#ifdef RCT_NEW_ARCH_ENABLED
@implementation RNSVGConvert

+ (RNSVGUnits)RNSVGUnitsFromFilterUnitsCppEquivalent:(react::RNSVGFilterFilterUnits)svgUnits
{
  switch (svgUnits) {
    case react::RNSVGFilterFilterUnits::UserSpaceOnUse:
      return kRNSVGUnitsUserSpaceOnUse;
    case react::RNSVGFilterFilterUnits::ObjectBoundingBox:
      return kRNSVGUnitsObjectBoundingBox;
  }
}

+ (RNSVGUnits)RNSVGUnitsFromPrimitiveUnitsCppEquivalent:(react::RNSVGFilterPrimitiveUnits)svgUnits
{
  switch (svgUnits) {
    case react::RNSVGFilterPrimitiveUnits::UserSpaceOnUse:
      return kRNSVGUnitsUserSpaceOnUse;
    case react::RNSVGFilterPrimitiveUnits::ObjectBoundingBox:
      return kRNSVGUnitsObjectBoundingBox;
  }
}

+ (RNSVGColorMatrixType)RNSVGColorMatrixTypeFromCppEquivalent:(react::RNSVGFeColorMatrixType)type
{
  switch (type) {
    case react::RNSVGFeColorMatrixType::Matrix:
      return SVG_FECOLORMATRIX_TYPE_MATRIX;
    case react::RNSVGFeColorMatrixType::Saturate:
      return SVG_FECOLORMATRIX_TYPE_SATURATE;
    case react::RNSVGFeColorMatrixType::HueRotate:
      return SVG_FECOLORMATRIX_TYPE_HUEROTATE;
    case react::RNSVGFeColorMatrixType::LuminanceToAlpha:
      return SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA;
  }
}

+ (RNSVGEdgeMode)RNSVGEdgeModeFromCppEquivalent:(react::RNSVGFeGaussianBlurEdgeMode)edgeMode
{
  switch (edgeMode) {
    case react::RNSVGFeGaussianBlurEdgeMode::Duplicate:
      return SVG_EDGEMODE_DUPLICATE;
    case react::RNSVGFeGaussianBlurEdgeMode::Wrap:
      return SVG_EDGEMODE_WRAP;
    case react::RNSVGFeGaussianBlurEdgeMode::None:
      return SVG_EDGEMODE_NONE;
    default:
      return SVG_EDGEMODE_UNKNOWN;
  }
}

@end

#endif // RCT_NEW_ARCH_ENABLED

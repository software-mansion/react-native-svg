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

+ (RNSVGBlendMode)RNSVGBlendModeFromCppEquivalent:(react::RNSVGFeBlendMode)mode
{
  switch (mode) {
    case react::RNSVGFeBlendMode::Unknown:
      return SVG_FEBLEND_MODE_UNKNOWN;
    case react::RNSVGFeBlendMode::Normal:
      return SVG_FEBLEND_MODE_NORMAL;
    case react::RNSVGFeBlendMode::Multiply:
      return SVG_FEBLEND_MODE_MULTIPLY;
    case react::RNSVGFeBlendMode::Screen:
      return SVG_FEBLEND_MODE_SCREEN;
    case react::RNSVGFeBlendMode::Darken:
      return SVG_FEBLEND_MODE_DARKEN;
    case react::RNSVGFeBlendMode::Lighten:
      return SVG_FEBLEND_MODE_LIGHTEN;
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

+ (RNSVGCompositeOperator)RNSVGRNSVGCompositeOperatorFromCppEquivalent:(react::RNSVGFeCompositeOperator1)operator1
{
  switch (operator1) {
    case react::RNSVGFeCompositeOperator1::Over:
      return SVG_FECOMPOSITE_OPERATOR_OVER;
    case react::RNSVGFeCompositeOperator1::In:
      return SVG_FECOMPOSITE_OPERATOR_IN;
    case react::RNSVGFeCompositeOperator1::Out:
      return SVG_FECOMPOSITE_OPERATOR_OUT;
    case react::RNSVGFeCompositeOperator1::Atop:
      return SVG_FECOMPOSITE_OPERATOR_ATOP;
    case react::RNSVGFeCompositeOperator1::Xor:
      return SVG_FECOMPOSITE_OPERATOR_XOR;
    case react::RNSVGFeCompositeOperator1::Arithmetic:
      return SVG_FECOMPOSITE_OPERATOR_ARITHMETIC;
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

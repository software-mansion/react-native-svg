#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnsvg/Props.h>
#import "RNSVGBlendMode.h"
#import "RNSVGColorMatrixType.h"
#import "RNSVGCompositeOperator.h"
#import "RNSVGEdgeMode.h"
#import "RNSVGUnits.h"
#import "RNSVGTurbulenceStitchTile.h"
#import "RNSVGTurbulenceType.h"

namespace react = facebook::react;

@interface RNSVGConvert : NSObject

+ (RNSVGUnits)RNSVGUnitsFromFilterUnitsCppEquivalent:(react::RNSVGFilterFilterUnits)svgUnits;
+ (RNSVGUnits)RNSVGUnitsFromPrimitiveUnitsCppEquivalent:(react::RNSVGFilterPrimitiveUnits)svgUnits;
+ (RNSVGBlendMode)RNSVGBlendModeFromCppEquivalent:(react::RNSVGFeBlendMode)mode;
+ (RNSVGColorMatrixType)RNSVGColorMatrixTypeFromCppEquivalent:(react::RNSVGFeColorMatrixType)type;
+ (RNSVGCompositeOperator)RNSVGRNSVGCompositeOperatorFromCppEquivalent:(react::RNSVGFeCompositeOperator1)operator1;
+ (RNSVGEdgeMode)RNSVGEdgeModeFromCppEquivalent:(react::RNSVGFeGaussianBlurEdgeMode)edgeMode;
+ (RNSVGTurbulenceStitchTile)RNSVGTurbulenceStitchTileFromCppEquivalent:(react::RNSVGFeTurbulenceStitchTiles)stitchTiles;
+ (RNSVGTurbulenceType)RNSVGTurbulenceTypeFromCppEquivalent:(react::RNSVGFeTurbulenceType)type;

@end

#endif // RCT_NEW_ARCH_ENABLED

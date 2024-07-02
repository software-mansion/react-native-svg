#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnsvg/Props.h>
#import "RNSVGColorMatrixType.h"
#import "RNSVGEdgeModeTypes.h"
#import "RNSVGUnits.h"

namespace react = facebook::react;

@interface RNSVGConvert : NSObject

+ (RNSVGUnits)RNSVGUnitsFromFilterUnitsCppEquivalent:(react::RNSVGFilterFilterUnits)svgUnits;
+ (RNSVGUnits)RNSVGUnitsFromPrimitiveUnitsCppEquivalent:(react::RNSVGFilterPrimitiveUnits)svgUnits;
+ (RNSVGColorMatrixType)RNSVGColorMatrixTypeFromCppEquivalent:(react::RNSVGFeColorMatrixType)type;

@end

#endif // RCT_NEW_ARCH_ENABLED

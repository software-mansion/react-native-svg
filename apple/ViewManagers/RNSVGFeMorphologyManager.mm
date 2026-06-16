#import "RNSVGFeMorphologyManager.h"
#import "RNSVGMorphologyOperator.h"
#import "RNSVGFeMorphology.h"

@implementation RNSVGFeMorphologyManager

RCT_EXPORT_MODULE()

- (RNSVGFeMorphology *)node
{
  return [RNSVGFeMorphology new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(operator1, RNSVGMorphologyOperator)
RCT_EXPORT_VIEW_PROPERTY(radius, NSArray<RNSVGLength *>)

@end

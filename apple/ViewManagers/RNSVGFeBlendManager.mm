#import "RNSVGFeBlendManager.h"
#import "RNSVGBlendMode.h"
#import "RNSVGFeBlend.h"

@implementation RNSVGFeBlendManager

RCT_EXPORT_MODULE()

- (RNSVGFeBlend *)node
{
  return [RNSVGFeBlend new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(in2, NSString)
RCT_EXPORT_VIEW_PROPERTY(mode, RNSVGBlendMode)

@end

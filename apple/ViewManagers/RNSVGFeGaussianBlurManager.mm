#import "RNSVGFeGaussianBlurManager.h"
#import "RNSVGEdgeMode.h"
#import "RNSVGFeGaussianBlur.h"

@implementation RNSVGFeGaussianBlurManager

RCT_EXPORT_MODULE()

- (RNSVGFeGaussianBlur *)node
{
  return [RNSVGFeGaussianBlur new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(stdDeviationX, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(stdDeviationY, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(edgeMode, RNSVGEdgeMode)

@end

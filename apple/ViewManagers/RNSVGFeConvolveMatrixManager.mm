#import "RNSVGFeConvolveMatrixManager.h"
#import "RNSVGEdgeMode.h"
#import "RNSVGFeConvolveMatrix.h"

@implementation RNSVGFeConvolveMatrixManager

RCT_EXPORT_MODULE()

- (RNSVGFeConvolveMatrix *)node
{
  return [RNSVGFeConvolveMatrix new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(order, NSArray<RNSVGLength *>)
RCT_EXPORT_VIEW_PROPERTY(kernelMatrix, NSArray<RNSVGLength *>)
RCT_EXPORT_VIEW_PROPERTY(divisor, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(bias, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(targetX, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(targetY, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(edgeMode, RNSVGEdgeMode)
RCT_EXPORT_VIEW_PROPERTY(preserveAlpha, bool)

@end

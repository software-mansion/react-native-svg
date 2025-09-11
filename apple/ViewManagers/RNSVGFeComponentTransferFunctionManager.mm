#import "RNSVGFeComponentTransferFunctionManager.h"
#import "RNSVGComponentTransferFuncType.h"
#import "RNSVGComponentTransferFuncChannel.h"
#import "RNSVGFeComponentTransferFunction.h"

@implementation RNSVGFeComponentTransferFunctionManager

RCT_EXPORT_MODULE()

- (RNSVGFeComponentTransferFunction *)node
{
  return [RNSVGFeComponentTransferFunction new];
}

RCT_EXPORT_VIEW_PROPERTY(channel, RNSVGComponentTransferFuncChannel)
RCT_EXPORT_VIEW_PROPERTY(type, RNSVGComponentTransferFuncType)
RCT_EXPORT_VIEW_PROPERTY(tableValues, NSArray<RNSVGLength *>)
RCT_EXPORT_VIEW_PROPERTY(slope, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(intercept, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(amplitude, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(exponent, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(offset, RNSVGLength *)

@end

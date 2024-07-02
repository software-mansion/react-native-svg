#import "RNSVGFilterPrimitiveManager.h"
#import "RNSVGFilterPrimitive.h"

@implementation RNSVGFilterPrimitiveManager

RCT_EXPORT_MODULE()

- (RNSVGFilterPrimitive *)node
{
  return [RNSVGFilterPrimitive new];
}

RCT_EXPORT_VIEW_PROPERTY(x, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(y, RNSVGLength *)
RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGFilterPrimitive)
{
  view.width = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGFilterPrimitive)
{
  view.height = [RCTConvert RNSVGLength:json];
}
RCT_EXPORT_VIEW_PROPERTY(result, NSString)

@end

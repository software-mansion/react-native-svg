#import "RNSVGFilterPrimitiveManager.h"
#import "RNSVGFilterPrimitive.h"

@implementation RNSVGFilterPrimitiveManager

RCT_EXPORT_MODULE()

- (RNSVGFilterPrimitive *)node
{
  return [RNSVGFilterPrimitive new];
}

RCT_CUSTOM_VIEW_PROPERTY(x, id, RNSVGFilterPrimitive)
{
  view.filterRegion.x = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(y, id, RNSVGFilterPrimitive)
{
  view.filterRegion.y = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGFilterPrimitive)
{
  view.filterRegion.width = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGFilterPrimitive)
{
  view.filterRegion.height = [RCTConvert RNSVGLength:json];
}
RCT_EXPORT_VIEW_PROPERTY(result, NSString)

@end

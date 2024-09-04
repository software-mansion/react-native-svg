#import "RNSVGFilterManager.h"
#import "RNSVGFilter.h"

@implementation RNSVGFilterManager

RCT_EXPORT_MODULE()

- (RNSVGFilter *)node
{
  return [RNSVGFilter new];
}

RCT_CUSTOM_VIEW_PROPERTY(x, id, RNSVGFilter)
{
  view.filterRegion.x = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(y, id, RNSVGFilter)
{
  view.filterRegion.y = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGFilter)
{
  view.filterRegion.width = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGFilter)
{
  view.filterRegion.height = [RCTConvert RNSVGLength:json];
}
RCT_EXPORT_VIEW_PROPERTY(filterUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(primitiveUnits, RNSVGUnits)

@end

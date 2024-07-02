#import "RNSVGFilterManager.h"
#import "RNSVGFilter.h"

@implementation RNSVGFilterManager

RCT_EXPORT_MODULE()

- (RNSVGFilter *)node
{
  return [RNSVGFilter new];
}

RCT_EXPORT_VIEW_PROPERTY(x, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(y, RNSVGLength *)
RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGFilter)
{
  view.width = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGFilter)
{
  view.height = [RCTConvert RNSVGLength:json];
}
RCT_EXPORT_VIEW_PROPERTY(filterUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(primitiveUnits, RNSVGUnits)

@end

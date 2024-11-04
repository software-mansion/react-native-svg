#import "RNSVGFeFloodManager.h"
#import "RNSVGFeFlood.h"

@implementation RNSVGFeFloodManager

RCT_EXPORT_MODULE()

- (RNSVGFeFlood *)node
{
  return [RNSVGFeFlood new];
}

RCT_EXPORT_VIEW_PROPERTY(floodColor, RNSVGBrush)
RCT_EXPORT_VIEW_PROPERTY(floodOpacity, CGFloat)

@end

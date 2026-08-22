#import "RNSVGFeDisplacementMapManager.h"
#import "RNSVGChannelSelector.h"
#import "RNSVGFeDisplacementMap.h"

@implementation RNSVGFeDisplacementMapManager

RCT_EXPORT_MODULE()

- (RNSVGFeDisplacementMap *)node
{
  return [RNSVGFeDisplacementMap new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(in2, NSString)
RCT_EXPORT_VIEW_PROPERTY(scale, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(xChannelSelector, RNSVGChannelSelector)
RCT_EXPORT_VIEW_PROPERTY(yChannelSelector, RNSVGChannelSelector)

@end

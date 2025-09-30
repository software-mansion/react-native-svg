#import "RNSVGFeOffsetManager.h"
#import "RNSVGFeOffset.h"

@implementation RNSVGFeOffsetManager

RCT_EXPORT_MODULE()

- (RNSVGFeOffset *)node
{
  return [RNSVGFeOffset new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(dx, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(dy, RNSVGLength *)

@end

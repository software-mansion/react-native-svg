#import "RNSVGFeCompositeManager.h"
#import "RNSVGCompositeOperator.h"
#import "RNSVGFeComposite.h"

@implementation RNSVGFeCompositeManager

RCT_EXPORT_MODULE()

- (RNSVGFeComposite *)node
{
  return [RNSVGFeComposite new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(in2, NSString)
RCT_EXPORT_VIEW_PROPERTY(operator1, RNSVGCompositeOperator)
RCT_EXPORT_VIEW_PROPERTY(k1, NSNumber *)
RCT_EXPORT_VIEW_PROPERTY(k2, NSNumber *)
RCT_EXPORT_VIEW_PROPERTY(k3, NSNumber *)
RCT_EXPORT_VIEW_PROPERTY(k4, NSNumber *)

@end

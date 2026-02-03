#import "RNSVGFeComponentTransferManager.h"
#import "RNSVGFeComponentTransfer.h"

@implementation RNSVGFeComponentTransferManager

RCT_EXPORT_MODULE()

- (RNSVGFeComponentTransfer *)node
{
  return [RNSVGFeComponentTransfer new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)

@end

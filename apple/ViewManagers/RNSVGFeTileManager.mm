#import "RNSVGFeTileManager.h"
#import "RNSVGFeTile.h"

@implementation RNSVGFeTileManager

RCT_EXPORT_MODULE()

- (RNSVGFeTile *)node
{
  return [RNSVGFeTile new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)

@end

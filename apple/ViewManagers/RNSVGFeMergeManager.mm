#import "RNSVGFeMergeManager.h"
#import "RNSVGFeMerge.h"

@implementation RNSVGFeMergeManager

RCT_EXPORT_MODULE()

- (RNSVGFeMerge *)node
{
  return [RNSVGFeMerge new];
}

RCT_EXPORT_VIEW_PROPERTY(nodes, NSArray<NSString *>)

@end

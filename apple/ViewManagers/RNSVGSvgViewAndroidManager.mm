#import "RNSVGSvgViewAndroidManager.h"
#import "RNSVGSvgViewAndroid.h"

@implementation RNSVGSvgViewAndroidManager

RCT_EXPORT_MODULE()

- (RNSVGSvgViewAndroid *)view
{
  return [RNSVGSvgViewAndroid new];
}

@end

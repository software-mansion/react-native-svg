#import <RNSVGFilterPrimitive.h>
#import <RNSVGNode.h>
#import "RNSVGFilter.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFilterPrimitive

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _filterSubregion = [[RNSVGFilterRegion alloc] init];
  _result = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

- (instancetype)init
{
  self = [super init];
  if (self) {
    _filterSubregion = [[RNSVGFilterRegion alloc] init];
  }
  return self;
}

- (RNSVGPlatformView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  return nil;
}

- (void)parseReference
{
}

- (void)invalidate
{
  self.dirty = false;
  [super invalidate];
}

- (void)setX:(RNSVGLength *)x
{
  if ([x isEqualTo:_filterSubregion.x]) {
    return;
  }

  [_filterSubregion setX:x];
  [self invalidate];
}

- (void)setY:(RNSVGLength *)y
{
  if ([y isEqualTo:_filterSubregion.y]) {
    return;
  }

  [_filterSubregion setY:y];
  [self invalidate];
}

- (void)setWidth:(RNSVGLength *)width
{
  if ([width isEqualTo:_filterSubregion.width]) {
    return;
  }

  [_filterSubregion setWidth:width];
  [self invalidate];
}

- (void)setHeight:(RNSVGLength *)height
{
  if ([height isEqualTo:_filterSubregion.height]) {
    return;
  }

  [_filterSubregion setHeight:height];
  [self invalidate];
}

- (void)setResult:(NSString *)result
{
  if ([result isEqualToString:_result]) {
    return;
  }

  _result = result;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  return previous;
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
                     ctm:(CGAffineTransform)ctm
{
  return [self applyFilter:results previousFilterResult:previous];
}

@end

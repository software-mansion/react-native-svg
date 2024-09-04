#import <RNSVGFilterPrimitive.h>
#import <RNSVGNode.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import <react/renderer/components/view/conversions.h>
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFilterPrimitive

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle
{
  [super prepareForRecycle];
  [_filterRegion resetProperties];
  _result = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

- (id)init
{
  if (self = [super init]) {
    _filterRegion = [[RNSVGFilterRegion alloc] init];
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
  if ([x isEqualTo:_filterRegion.x]) {
    return;
  }

  [_filterRegion setX:x];
  [self invalidate];
}

- (void)setY:(RNSVGLength *)y
{
  if ([y isEqualTo:_filterRegion.y]) {
    return;
  }

  [_filterRegion setY:y];
  [self invalidate];
}

- (void)setWidth:(RNSVGLength *)width
{
  if ([width isEqualTo:_filterRegion.width]) {
    return;
  }

  [_filterRegion setWidth:width];
  [self invalidate];
}

- (void)setHeight:(RNSVGLength *)height
{
  if ([height isEqualTo:_filterRegion.height]) {
    return;
  }

  [_filterRegion setHeight:height];
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

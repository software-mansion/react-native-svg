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
  _x = nil;
  _y = nil;
  _height = nil;
  _width = nil;
  _result = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

- (RNSVGPlatformView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  return nil;
}

- (void)parseReference
{
}

- (void)setX:(RNSVGLength *)x
{
  if ([x isEqualTo:_x]) {
    return;
  }

  _x = x;
  [self invalidate];
}

- (void)invalidate
{
  self.dirty = false;
  [super invalidate];
}

- (void)setY:(RNSVGLength *)y
{
  if ([y isEqualTo:_y]) {
    return;
  }

  _y = y;
  [self invalidate];
}

- (void)setWidth:(RNSVGLength *)width
{
  if ([width isEqualTo:_width]) {
    return;
  }

  _width = width;
  [self invalidate];
}

- (void)setHeight:(RNSVGLength *)height
{
  if ([height isEqualTo:_height]) {
    return;
  }

  _height = height;
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

- (CIImage *)cropResult:(CIImage *)result
{
  CIFilter *filter = [CIFilter filterWithName:@"CICrop"];
  [filter setDefaults];
  [filter setValue:result forKey:@"inputImage"];
  CGFloat x = [self relativeOnWidth:self.x];
  CGFloat y = [self relativeOnHeight:self.y];
  CGFloat width = [self relativeOnWidth:self.width];
  CGFloat height = [self relativeOnHeight:self.height];

  [filter setValue:[CIVector vectorWithX:x Y:y Z:width W:height] forKey:@"inputRectangle"];
  return [filter valueForKey:@"outputImage"];
}

@end

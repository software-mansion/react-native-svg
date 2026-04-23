#import "RNSVGFeDisplacementMap.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

static CIColorKernel *thresholdKernel;

@implementation RNSVGFeDisplacementMap

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGFeDisplacementMapProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeDisplacementMapComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeDisplacementMapProps &>(*props);
  
  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);
  self.in2 = RCTNSStringFromStringNilIfEmpty(newProps.in2);
  id scale = RNSVGConvertFollyDynamicToId(newProps.scale);
  if (scale != nil) {
    self.scale = [RCTConvert RNSVGLength:scale];
  }
  self.xChannelSelector = [RNSVGConvert RNSVGXChannelSelectorFromCppEquivalent:newProps.xChannelSelector];
  self.yChannelSelector = [RNSVGConvert RNSVGYChannelSelectorFromCppEquivalent:newProps.yChannelSelector];
  
  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeDisplacementMapProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _in2 = nil;
  _scale = 0;
  _xChannelSelector = SVG_CHANNEL_SELECTOR_A;
  _yChannelSelector = SVG_CHANNEL_SELECTOR_A;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setIn1:(NSString *)in1
{
  if ([in1 isEqualToString:_in1]) {
    return;
  }
  
  _in1 = in1;
  [self invalidate];
}

- (void)setIn2:(NSString *)in2
{
  if ([in2 isEqualToString:_in2]) {
    return;
  }
  
  _in2 = in2;
  [self invalidate];
}

- (void)setScale:(RNSVGLength *)scale
{
  if ([scale isEqualTo:_scale]) {
    return;
  }
  
  _scale = scale;
  [self invalidate];
}

- (void)setXChannelSelector:(RNSVGChannelSelector)xChannelSelector
{
  if (xChannelSelector == _xChannelSelector) {
    return;
  }
  _xChannelSelector = xChannelSelector;
  [self invalidate];
}

- (void)setYChannelSelector:(RNSVGChannelSelector)yChannelSelector
{
  if (yChannelSelector == _yChannelSelector) {
    return;
  }
  _yChannelSelector = yChannelSelector;
  [self invalidate];
}


- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  CIImage *inResults1 = self.in1 ? results[self.in1] : nil;
  CIImage *inResults2 = self.in2 ? results[self.in2] : nil;
  CIImage *inputImage1 = inResults1 ?: previous;
  CIImage *inputImage2 = inResults2 ?: previous;

  if (!inputImage1 || !inputImage2) return nil;

  CIContext *ciCtx = [CIContext contextWithOptions:nil];
  CGImageRef in1Ref = [ciCtx createCGImage:inputImage1 fromRect:inputImage1.extent];
  if (!in1Ref) {
      if (in1Ref) CGImageRelease(in1Ref);
      return nil;
  }

  size_t width  = CGImageGetWidth(in1Ref);
  size_t height = CGImageGetHeight(in1Ref);
  size_t bufferSize = width * height * sizeof(uint32_t);

  uint32_t *in1Pixels = (uint32_t *)malloc(bufferSize);
  uint32_t *in2Pixels = (uint32_t *)malloc(bufferSize);
  uint32_t *outPixels = (uint32_t *)malloc(bufferSize);
  
  if (!in1Pixels || !in2Pixels || !outPixels) {
      CGImageRelease(in1Ref);
      free(in1Pixels); free(in2Pixels); free(outPixels);
      return nil;
  }

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef ctx1 = CGBitmapContextCreate(in1Pixels, width, height, 8, width * 4,
                                            colorSpace, (CGBitmapInfo)kCGImageAlphaPremultipliedFirst | kCGBitmapByteOrder32Big);
  CGColorSpaceRelease(colorSpace);

  [ciCtx render:inputImage2
         toBitmap:in2Pixels
         rowBytes:width*4
           bounds:inputImage2.extent
           format:kCIFormatRGBA8
       colorSpace:CGColorSpaceCreateDeviceRGB()];

  if (!ctx1) {
      CGImageRelease(in1Ref);
      free(in1Pixels); free(in2Pixels); free(outPixels);
      return nil;
  }

  CGContextDrawImage(ctx1, CGRectMake(0, 0, width, height), in1Ref);
  CGContextRelease(ctx1);
  CGImageRelease(in1Ref);
  
#if TARGET_OS_OSX
  double screenScale = [[NSScreen mainScreen] backingScaleFactor];
 #else
  double screenScale = [UIScreen mainScreen].scale;
#endif

  float scaleValue = _scale.value * screenScale;

  // Main displacement loop
  for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
          int idx = (int) (y * width + x);

          uint32_t color2 = in2Pixels[idx];

          float xc = [self getChannelValue:color2 selector:_xChannelSelector] / 255.0f;
          float yc = [self getChannelValue:color2 selector:_yChannelSelector] / 255.0f;

          float dx = scaleValue * (xc - 0.5f);
          float dy = scaleValue * (yc - 0.5f);

          float srcX = x + dx;
          float srcY = y + dy;

          outPixels[idx] = [self sampleBilinear:in1Pixels width:(int)width height:(int)height fx:srcX fy:srcY];
      }
  }

  // Create CGImage from outPixels
  CGColorSpaceRef outColorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef outCtx = CGBitmapContextCreate(outPixels, width, height, 8, width * 4,
                                              outColorSpace, (CGBitmapInfo)kCGImageAlphaPremultipliedFirst | kCGBitmapByteOrder32Big);
  CGColorSpaceRelease(outColorSpace);

  CGImageRef outCG = CGBitmapContextCreateImage(outCtx);
  CGContextRelease(outCtx);

  free(in1Pixels);
  free(in2Pixels);
  free(outPixels);

  if (!outCG) return nil;
  CIImage *result = [CIImage imageWithCGImage:outCG];
  CGImageRelease(outCG);
  return result;

}

- (int)getChannelValue:(int)color selector:(RNSVGChannelSelector)selector {
  switch (selector) {
    case SVG_CHANNEL_SELECTOR_R: return (color >> 24) & 0xFF;
    case SVG_CHANNEL_SELECTOR_G: return (color >> 16) & 0xFF;
    case SVG_CHANNEL_SELECTOR_B: return (color >> 8)  & 0xFF;
    case SVG_CHANNEL_SELECTOR_A: return (color >> 0)  & 0xFF;
    default: return 0;
  }
}


- (int)sampleBilinear:(uint32_t *)pixels width:(int)width height:(int)height fx:(float)fx fy:(float)fy {
  fx = MIN(MAX(fx, 0.0f), width - 1.0f);
  fy = MIN(MAX(fy, 0.0f), height - 1.0f);
  
  int x0 = floorf(fx);
  int y0 = floorf(fy);
  int x1 = x0 + 1;
  int y1 = y0 + 1;
  
  float wx = fx - x0;
  float wy = fy - y0;
  
  if (x0 < 0 || y0 < 0 || x1 >= width || y1 >= height) {
    return 0;
  }
  
  int c00 = pixels[y0 * width + x0];
  int c10 = pixels[y0 * width + x1];
  int c01 = pixels[y1 * width + x0];
  int c11 = pixels[y1 * width + x1];
  
  return [self bilerp:c00 c10:c10 c01:c01 c11:c11 wx:wx wy:wy];
}

- (int)bilerp:(int)c00 c10:(int)c10 c01:(int)c01 c11:(int)c11 wx:(float)wx wy:(float)wy {
  float* c0 = [self lerpColor:c00 c1:c10 t:wx];
  float* c1 = [self lerpColor:c01 c1:c11 t:wx];
  float* c = (float*)malloc(sizeof(float)*4);
  
  for (int i = 0; i < 4; i++) {
    c[i] = c0[i] * (1 - wy) + c1[i] * wy;
  }
  
  return ((int)c[3] << 24) | ((int)c[0] << 16) | ((int)c[1] << 8) | (int)c[2];
}

- (float*)lerpColor:(int)c0 c1:(int)c1 t:(float)t {
  float a0 = (c0 >> 24) & 0xFF;
  float r0 = (c0 >> 16) & 0xFF;
  float g0 = (c0 >> 8) & 0xFF;
  float b0 = c0 & 0xFF;
  
  float a1 = (c1 >> 24) & 0xFF;
  float r1 = (c1 >> 16) & 0xFF;
  float g1 = (c1 >> 8) & 0xFF;
  float b1 = c1 & 0xFF;
  
  float* result = (float*)malloc(sizeof(float)*4);
  
  result[0] = r0 + (r1 - r0) * t;
  result[1] = g0 + (g1 - g0) * t;
  result[2] = b0 + (b1 - b0) * t;
  result[3] = a0 + (a1 - a0) * t;
  
  return result;
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeDisplacementMapCls(void)
{
  return RNSVGFeDisplacementMap.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

#import "RNSVGFeComponentTransfer.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeComponentTransfer

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
    static const auto defaultProps = std::make_shared<const RNSVGFeComponentTransferProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeComponentTransferComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeComponentTransferProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeComponentTransferProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _FeFuncR = nil;
  _FeFuncG = nil;
  _FeFuncB = nil;
  _FeFuncA = nil;
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

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  CIImage *inResults1 = self.in1 ? [results objectForKey:self.in1] : nil;
  CIImage *inputImage1 = inResults1 ? inResults1 : previous;
  [self assignFeComponentTransferFunctionViews];
  
  CIContext *ciContext = [CIContext contextWithOptions:nil];
  CGImageRef cgImage = [ciContext createCGImage:inputImage1 fromRect:inputImage1.extent];
  
  size_t width = CGImageGetWidth(cgImage), height = CGImageGetHeight(cgImage);
  uint32_t *pixels = (uint32_t *)malloc(width * height * sizeof(uint32_t));
  if (!pixels) {
    CGImageRelease(cgImage);
    return inputImage1;
  }

  // Create RGBA bitmap context
  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef context = CGBitmapContextCreate(
      pixels,
      width,
      height,
      8,
      width * 4,
      colorSpace,
      (CGBitmapInfo)kCGBitmapByteOrder32Big | kCGImageAlphaPremultipliedLast
  );
  CGColorSpaceRelease(colorSpace);

  // Draw CGImage into context (fills pixels buffer)
  CGContextDrawImage(context, CGRectMake(0, 0, width, height), cgImage);
  CGImageRelease(cgImage);

  [self applyComponentTransferOnPixels:pixels length:width * height];

  CGImageRef outputCGImage = CGBitmapContextCreateImage(context);
  CIImage *outputCIImage = [CIImage imageWithCGImage:outputCGImage];

  CGImageRelease(outputCGImage);
  CGContextRelease(context);
  free(pixels);

  return outputCIImage;
}

- (void)applyComponentTransferOnPixels:(uint32_t *)pixels length:(size_t)length {
  uint8_t *bytes = (uint8_t *)pixels;
  
  for (size_t i = 0; i < length; i++) {
    size_t base = i * 4;
    
    double r = bytes[base + 0] / 255.0;
    double g = bytes[base + 1] / 255.0;
    double b = bytes[base + 2] / 255.0;
    double a = bytes[base + 3] / 255.0;
    
    if (a > 0) {
      r /= a; g /= a; b /= a;
    }

    if (self.FeFuncR) r = [self.FeFuncR apply:r];
    if (self.FeFuncG) g = [self.FeFuncG apply:g];
    if (self.FeFuncB) b = [self.FeFuncB apply:b];
    if (self.FeFuncA) a = [self.FeFuncA apply:a];
    
    r = fmin(fmax(r * a, 0.0), 1.0);
    g = fmin(fmax(g * a, 0.0), 1.0);
    b = fmin(fmax(b * a, 0.0), 1.0);
    
    bytes[base + 0] = (uint8_t)(r * 255.0 + 0.5);
    bytes[base + 1] = (uint8_t)(g * 255.0 + 0.5);
    bytes[base + 2] = (uint8_t)(b * 255.0 + 0.5);
    bytes[base + 3] = (uint8_t)(a * 255.0 + 0.5);
  }
}

- (void)assignFeComponentTransferFunctionViews
{
  for (RNSVGNode *node in self.subviews) {
    if (![node isKindOfClass:[RNSVGFeComponentTransferFunction class]]) {
      continue;
    }
    
    RNSVGFeComponentTransferFunction *functionView = (RNSVGFeComponentTransferFunction *)node;
    
    switch (functionView.channel) {
      case SVG_FECOMPONENTTRANSFERFUNC_CHANNEL_R:
        self.FeFuncR = functionView;
        break;
      case SVG_FECOMPONENTTRANSFERFUNC_CHANNEL_G:
        self.FeFuncG = functionView;
        break;
      case SVG_FECOMPONENTTRANSFERFUNC_CHANNEL_B:
        self.FeFuncB = functionView;
        break;
      case SVG_FECOMPONENTTRANSFERFUNC_CHANNEL_A:
        self.FeFuncA = functionView;
        break;
      default:
        break;
    }
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeComponentTransferCls(void)
{
  return RNSVGFeComponentTransfer.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

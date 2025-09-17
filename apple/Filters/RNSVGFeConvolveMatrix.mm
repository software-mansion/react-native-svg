#import "RNSVGFeConvolveMatrix.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

static const NSUInteger kBytesPerPixel = 4;
static const NSUInteger kBitsPerComponent = 8;

@implementation RNSVGFeConvolveMatrix

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
    static const auto defaultProps = std::make_shared<const RNSVGFeConvolveMatrixProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeConvolveMatrixComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeConvolveMatrixProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);
  
  id order = RNSVGConvertFollyDynamicToId(newProps.order);
  if (order != nil) {
    self.order = [RCTConvert RNSVGLengthArray:order];
  }
  
  id kernelMatrix = RNSVGConvertFollyDynamicToId(newProps.kernelMatrix);
  if (kernelMatrix != nil) {
    self.kernelMatrix = [RCTConvert RNSVGLengthArray:kernelMatrix];
  }
  
  id divisor = RNSVGConvertFollyDynamicToId(newProps.divisor);
  if (divisor != nil) {
    self.divisor = [RCTConvert RNSVGLength:divisor];
  }
  
  id bias = RNSVGConvertFollyDynamicToId(newProps.bias);
  if (bias != nil) {
    self.bias = [RCTConvert RNSVGLength:bias];
  }
  
  id targetX = RNSVGConvertFollyDynamicToId(newProps.targetX);
  if (targetX != nil) {
    self.targetX = [RCTConvert RNSVGLength:targetX];
  }
  
  id targetY = RNSVGConvertFollyDynamicToId(newProps.targetY);
  if (targetY != nil) {
    self.targetY = [RCTConvert RNSVGLength:targetY];
  }
  
  self.edgeMode = [RNSVGConvert RNSVGConvolveMatrixEdgeModeFromCppEquivalent:newProps.edgeMode];
  self.preserveAlpha = newProps.preserveAlpha;

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeConvolveMatrixProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _order = nil;
  _kernelMatrix = nil;
  _divisor = [RNSVGLength lengthWithNumber:1];
  _bias = [RNSVGLength lengthWithNumber:0];
  _targetX = nil;
  _targetY = nil;
  _edgeMode = RNSVGEdgeMode::SVG_EDGEMODE_DUPLICATE;
  _preserveAlpha = false;
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

- (void)setOrder:(NSArray<RNSVGLength *> *)order
{
  if (order == _order) {
    return;
  }

  _order = order;
  [self invalidate];
}

- (void)setKernelMatrix:(NSArray<RNSVGLength *> *)kernelMatrix
{
  if (kernelMatrix == _kernelMatrix) {
    return;
  }

  _kernelMatrix = kernelMatrix;
  [self invalidate];
}

- (void)setDivisor:(RNSVGLength *)divisor
{
  if ([divisor isEqualTo:_divisor]) {
    return;
  }

  _divisor = divisor;
  [self invalidate];
}

- (void)setBias:(RNSVGLength *)bias
{
  if ([bias isEqualTo:_bias]) {
    return;
  }

  _bias = bias;
  [self invalidate];
}

- (void)setTargetX:(RNSVGLength *)targetX
{
  if ([targetX isEqualTo:_targetX]) {
    return;
  }

  _targetX = targetX;
  [self invalidate];
}

- (void)setTargetY:(RNSVGLength *)targetY
{
  if ([targetY isEqualTo:_targetY]) {
    return;
  }

  _targetY = targetY;
  [self invalidate];
}

- (void)setEdgeMode:(RNSVGEdgeMode)edgeMode
{
  if (edgeMode == _edgeMode) {
    return;
  }
  _edgeMode = edgeMode;
  [self invalidate];
}

- (void)setPreserveAlpha:(bool)preserveAlpha
{
  if (preserveAlpha == _preserveAlpha) {
    return;
  }

  _preserveAlpha = preserveAlpha;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  CIImage *inResults1 = self.in1 ? results[self.in1] : nil;
  CIImage *inputImage1 = inResults1 ?: previous;
  
  return [self performConvolution:inputImage1];
}

- (CIImage *)performConvolution:(CIImage *)ciImage
{
  NSUInteger width, height;
  unsigned char *rawData;
  CGContextRef context = [self prepareContextForImage:ciImage width:&width height:&height imageData:&rawData];
  
  unsigned char *outData = (unsigned char *)calloc(height * width * kBytesPerPixel, sizeof(unsigned char));
  
  int orderX = [self getOrderX];
  int orderY = [self getOrderY];
  int kernelSize = orderX * orderY;
  float *kernel = (float *)malloc(sizeof(float) * kernelSize);
  [self getKernelMatrix:kernel orderX:orderX orderY:orderY];
  float divisor = [self getDivisor:kernel length:kernelSize];
  
  int targetX = [self getTargetX:orderX];
  int targetY = [self getTargetY:orderY];
  
  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      float r = 0, g = 0, b = 0, a = 0;
      
      for (int ky = 0; ky < orderY; ky++) {
        for (int kx = 0; kx < orderX; kx++) {
          int ix = x + (kx - targetX);
          int iy = y + (ky - targetY);
          
          unsigned char *samplePixel = NULL;
          switch (self.edgeMode) {
            case SVG_EDGEMODE_DUPLICATE:
              ix = MAX(0, MIN(ix, (int)width - 1));
              iy = MAX(0, MIN(iy, (int)height - 1));
              break;
            case SVG_EDGEMODE_WRAP:
              ix = (ix + width) % width;
              iy = (iy + height) % height;
              break;
            case SVG_EDGEMODE_NONE:
            case SVG_EDGEMODE_UNKNOWN:
            default:
              if (ix < 0 || iy < 0 || ix >= width || iy >= height) {
                continue;
              }
              break;
          }
          
          samplePixel = rawData + (iy * width * kBytesPerPixel + ix * kBytesPerPixel);
          float kval = kernel[(orderY - 1 - ky) * orderX + (orderX - 1 - kx)];
          
          a += samplePixel[3] * kval;
          r += samplePixel[0] * kval;
          g += samplePixel[1] * kval;
          b += samplePixel[2] * kval;
        }
      }
      
      r = r / divisor + self.bias.value;
      g = g / divisor + self.bias.value;
      b = b / divisor + self.bias.value;
      if (self.preserveAlpha) {
        a = rawData[y * width * kBytesPerPixel + x * kBytesPerPixel + 3];
      } else {
        a = a / divisor;
      }
      
      unsigned char *outPixel = outData + (y * width * kBytesPerPixel + x * kBytesPerPixel);
      outPixel[0] = (unsigned char)MIN(MAX(r, 0), 255);
      outPixel[1] = (unsigned char)MIN(MAX(g, 0), 255);
      outPixel[2] = (unsigned char)MIN(MAX(b, 0), 255);
      outPixel[3] = (unsigned char)MIN(MAX(a, 0), 255);
    }
  }
  
  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGContextRef outCtx = CGBitmapContextCreate(outData, width, height,
                                              kBitsPerComponent, width * kBytesPerPixel,
                                              colorSpace, kCGImageAlphaPremultipliedLast);
  CGImageRef outCGImage = CGBitmapContextCreateImage(outCtx);
  CIImage *outCI = [CIImage imageWithCGImage:outCGImage];
  
  CGColorSpaceRelease(colorSpace);
  CGContextRelease(outCtx);
  CGContextRelease(context);
  free(rawData);
  free(kernel);
  free(outData);
  
  return outCI;
}

- (CGContextRef)prepareContextForImage:(CIImage *)ciImage width:(NSUInteger *)width height:(NSUInteger *)height imageData:(unsigned char **)imageData
{
  CIContext *ctx = [CIContext contextWithOptions:nil];
  CGImageRef cgImage = [ctx createCGImage:ciImage fromRect:ciImage.extent];
  *width = CGImageGetWidth(cgImage);
  *height = CGImageGetHeight(cgImage);
  
  *imageData = (unsigned char *)calloc(*height * *width * kBytesPerPixel, sizeof(unsigned char));
  CGContextRef context = CGBitmapContextCreate(*imageData, *width, *height, kBitsPerComponent, kBytesPerPixel * *width,
                                               CGColorSpaceCreateDeviceRGB(),
                                               kCGImageAlphaPremultipliedLast);
  CGContextDrawImage(context, CGRectMake(0, 0, *width, *height), cgImage);
  CGImageRelease(cgImage);
  
  return context;
}

- (int)getOrderX
{
  if (self.order == nil || self.order.count == 0) {
    return 3;
  }
  return self.order[0].value;
}

- (int)getOrderY
{
  if (self.order == nil || self.order.count <= 1) {
    return [self getOrderX];
  }
  return self.order[1].value;
}

- (float)getDivisor:(float *)kernel length:(int)length
{
  float divisor = (self.divisor != nil) ? self.divisor.value : 0.0f;
  
  if (divisor == 0.0f) {
    float sum = 0.0f;
    for (int i = 0; i < length; i++) {
      sum += kernel[i];
    }
    divisor = (sum == 0.0f) ? 1.0f : sum;
  }
  
  return divisor;
}

- (void)getKernelMatrix:(float *)outKernel orderX:(int)orderX orderY:(int)orderY
{
  int count = orderX * orderY;
  for (int i = 0; i < count; i++) {
    outKernel[i] = self.kernelMatrix[i].value;
  }
}

- (int)getTargetX:(int)orderX
{
  return (self.targetX != nil) ? self.targetX.value : orderX / 2;
}

- (int)getTargetY:(int)orderY
{
  return (self.targetY != nil) ? self.targetY.value : orderY / 2;
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeConvolveMatrixCls(void)
{
  return RNSVGFeConvolveMatrix.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

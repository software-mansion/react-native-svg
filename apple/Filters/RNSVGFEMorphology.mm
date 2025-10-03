#import "RNSVGFeMorphology.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeMorphology

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
    static const auto defaultProps = std::make_shared<const RNSVGFeMorphologyProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeMorphologyComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeMorphologyProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);
  self.operator1 = [RNSVGConvert RNSVGMorphologyOperatorFromCppEquivalent:newProps.operator1];
  
  id radius = RNSVGConvertFollyDynamicToId(newProps.radius);
  if (radius != nil) {
    self.radius = [RCTConvert RNSVGLengthArray:radius];
  }

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeMorphologyProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _operator1 = RNSVGMorphologyOperator::SVG_FEMORPHOLOGY_OPERATOR_ERODE;
  _radius = @[[RNSVGLength lengthWithNumber:0]];
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

- (void)setOperator1:(RNSVGMorphologyOperator)operator1
{
  if (operator1 == _operator1) {
    return;
  }
  _operator1 = operator1;
  [self invalidate];
}

- (void)setRadius:(NSArray<RNSVGLength *> *)radius
{
   if (radius == _radius) {
    return;
  }

  _radius = radius;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  CIImage *inResults1 = self.in1 ? [results objectForKey:self.in1] : nil;
  CIImage *inputImage1 = inResults1 ? inResults1 : previous;
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
  
  [self applyMorphology:pixels width:width height:height];

  CGImageRef outputCGImage = CGBitmapContextCreateImage(context);
  CIImage *outputCIImage = [CIImage imageWithCGImage:outputCGImage];

  CGImageRelease(outputCGImage);
  CGContextRelease(context);
  free(pixels);

  return outputCIImage;
}

- (void)applyMorphology:(uint32_t *)srcPixels width:(int)width height:(int)height
{
  int total = width * height;
  uint32_t *tmpPixels = (uint32_t *)malloc(total * sizeof(uint32_t));
  uint32_t *dstPixels = (uint32_t *)malloc(total * sizeof(uint32_t));
  int radiusX = self.getRadiusX;
  int radiusY = self.getRadiusY;
  bool isErode = self.operator1 == SVG_FEMORPHOLOGY_OPERATOR_ERODE;
  
  if (radiusX == 0 && radiusY == 0) {
    return;
  }
  
  [self horizontalPass:srcPixels dst:tmpPixels width:width height:height radiusX:radiusX isErode:isErode];
  [self verticalPass:tmpPixels dst:dstPixels width:width height:height radiusY:radiusY isErode:isErode];
  
  memcpy(srcPixels, dstPixels, total * sizeof(uint32_t));
  
  free(tmpPixels);
  free(dstPixels);
}

-(NSInteger) getRadiusX
{
  if (self.radius != nil && self.radius.count == 1) {
    return MAX(0, (int) self.radius[0].value);
  }
  
  return 0;
}

-(NSInteger) getRadiusY
{
  if (self.radius != nil) {
    if (self.radius.count == 1) {
      return self.getRadiusX;
    }
    
    if (self.radius.count == 2) {
      return MAX(0, (int) self.radius[1].value);
    }
  }
  
  return 0;
}

- (void)horizontalPass:(uint32_t *)src dst:(uint32_t *)dst
                 width:(int)width height:(int)height
               radiusX:(int)radiusX isErode:(BOOL)isErode {
  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      PixelRange range;
      PixelRangeInit(&range);
      
      int startX = MAX(0, x - radiusX);
      int endX   = MIN(width - 1, x + radiusX);
      
      for (int nx = startX; nx <= endX; nx++) {
        PixelRangeInclude(&range, src[y * width + nx]);
      }
      
      dst[y * width + x] = PixelRangeResult(&range, isErode);
    }
  }
}

- (void)verticalPass:(uint32_t *)src dst:(uint32_t *)dst
               width:(int)width height:(int)height
             radiusY:(int)radiusY isErode:(BOOL)isErode {
  for (int y = 0; y < height; y++) {
    int startY = MAX(0, y - radiusY);
    int endY   = MIN(height - 1, y + radiusY);
    
    for (int x = 0; x < width; x++) {
      PixelRange range;
      PixelRangeInit(&range);
      
      for (int ny = startY; ny <= endY; ny++) {
        PixelRangeInclude(&range, src[ny * width + x]);
      }
      
      dst[y * width + x] = PixelRangeResult(&range, isErode);
    }
  }
}

typedef struct {
  int minR, minG, minB, minA;
  int maxR, maxG, maxB, maxA;
} PixelRange;

static inline void PixelRangeInit(PixelRange *range) {
  range->minR = range->minG = range->minB = range->minA = 255;
  range->maxR = range->maxG = range->maxB = range->maxA = 0;
}

static inline void PixelRangeInclude(PixelRange *range, uint32_t c) {
  int A = (c >> 24) & 0xFF;
  int R = (c >> 16) & 0xFF;
  int G = (c >> 8)  & 0xFF;
  int B = (c >> 0)  & 0xFF;
  
  if (R < range->minR) range->minR = R;
  if (G < range->minG) range->minG = G;
  if (B < range->minB) range->minB = B;
  if (A < range->minA) range->minA = A;
  
  if (R > range->maxR) range->maxR = R;
  if (G > range->maxG) range->maxG = G;
  if (B > range->maxB) range->maxB = B;
  if (A > range->maxA) range->maxA = A;
}

static inline uint32_t PixelRangeResult(const PixelRange *range, BOOL isErode) {
  int R = isErode ? range->minR : range->maxR;
  int G = isErode ? range->minG : range->maxG;
  int B = isErode ? range->minB : range->maxB;
  int A = isErode ? range->minA : range->maxA;
  
  return ((A & 0xFF) << 24) |
         ((R & 0xFF) << 16) |
         ((G & 0xFF) << 8)  |
         ((B & 0xFF));
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeMorphologyCls(void)
{
  return RNSVGFeMorphology.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

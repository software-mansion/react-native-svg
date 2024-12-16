#import "RNSVGFilter.h"
#import "RNSVGFilterPrimitive.h"
#import "RNSVGRenderUtils.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#import "rnsvg/RNSVGComponentDescriptors.h"
#endif // RCT_NEW_ARCH_ENABLED

#if TARGET_OS_OSX // [macOS
#import "RNSVGUIKit.h"
#endif // macOS]

@implementation RNSVGFilter {
  NSMutableDictionary<NSString *, CIImage *> *resultsMap;
}

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
    static const auto defaultProps = std::make_shared<const RNSVGFilterProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFilterComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFilterProps &>(*props);

  self.name = RCTNSStringFromStringNilIfEmpty(newProps.name);
  id x = RNSVGConvertFollyDynamicToId(newProps.x);
  if (x != nil) {
    self.x = [RCTConvert RNSVGLength:x];
  }
  id y = RNSVGConvertFollyDynamicToId(newProps.y);
  if (y != nil) {
    self.y = [RCTConvert RNSVGLength:y];
  }
  id height = RNSVGConvertFollyDynamicToId(newProps.height);
  if (height != nil) {
    self.height = [RCTConvert RNSVGLength:height];
  }
  id width = RNSVGConvertFollyDynamicToId(newProps.width);
  if (width != nil) {
    self.width = [RCTConvert RNSVGLength:width];
  }
  self.filterUnits = [RNSVGConvert RNSVGUnitsFromFilterUnitsCppEquivalent:newProps.filterUnits];
  self.primitiveUnits = [RNSVGConvert RNSVGUnitsFromPrimitiveUnitsCppEquivalent:newProps.primitiveUnits];

  _props = std::static_pointer_cast<RNSVGFilterProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _filterUnits = kRNSVGUnitsObjectBoundingBox;
  _primitiveUnits = kRNSVGUnitsUserSpaceOnUse;
  _filterRegion = [[RNSVGFilterRegion alloc] init];
}
#endif // RCT_NEW_ARCH_ENABLED

- (id)init
{
  if (self = [super init]) {
    resultsMap = [NSMutableDictionary dictionary];
    _filterRegion = [[RNSVGFilterRegion alloc] init];
  }
  return self;
}

- (CIImage *)applyFilter:(CIImage *)img
           backgroundImg:(CIImage *)backgroundImg
        renderableBounds:(CGRect)renderableBounds
            canvasBounds:(CGRect)canvasBounds
                     ctm:(CGAffineTransform)ctm
{
  [resultsMap removeAllObjects];
  [resultsMap setObject:img forKey:@"SourceGraphic"];
  [resultsMap setObject:applySourceAlphaFilter(img) forKey:@"SourceAlpha"];
  [resultsMap setObject:backgroundImg forKey:@"BackgroundImage"];
  [resultsMap setObject:applySourceAlphaFilter(backgroundImg) forKey:@"BackgroundAlpha"];

  // Setup crop filter
  CGRect cropRect;
  CIFilter *cropFilter = [CIFilter filterWithName:@"CIBlendWithMask"];
  [cropFilter setDefaults];
  [cropFilter setValue:nil forKey:@"inputBackgroundImage"];
  CGContext *cropContext = [self openContext:canvasBounds.size];
  CIImage *mask;

  CGRect filterRegionRect = [self.filterRegion getCropRect:self units:self.filterUnits bounds:renderableBounds];
  CIImage *result = img;
  RNSVGFilterPrimitive *currentFilter;
  for (RNSVGNode *node in self.subviews) {
    if ([node isKindOfClass:[RNSVGFilterPrimitive class]]) {
      currentFilter = (RNSVGFilterPrimitive *)node;
      cropRect = [currentFilter.filterSubregion
          getCropRect:currentFilter
                units:self.primitiveUnits
               bounds:self.primitiveUnits == kRNSVGUnitsUserSpaceOnUse ? filterRegionRect : renderableBounds];
      mask = [self getMaskFromRect:cropContext rect:cropRect ctm:ctm];
      [cropFilter setValue:[currentFilter applyFilter:resultsMap previousFilterResult:result ctm:ctm]
                    forKey:@"inputImage"];
      [cropFilter setValue:mask forKey:@"inputMaskImage"];
      CGContextClearRect(cropContext, canvasBounds);

      CGImageRef cgResult = [[RNSVGRenderUtils sharedCIContext] createCGImage:[cropFilter valueForKey:@"outputImage"]
                                                                     fromRect:[result extent]];
      result = [CIImage imageWithCGImage:cgResult];
      CGImageRelease(cgResult);
      if (result != nil && currentFilter.result) {
        [resultsMap setObject:result forKey:currentFilter.result];
      }
    } else {
      RCTLogError(@"Invalid `Filter` subview: Filter children can only be `Fe...` components");
    }
  }

  mask = [self getMaskFromRect:cropContext rect:filterRegionRect ctm:ctm];
  [cropFilter setValue:result forKey:@"inputImage"];
  [cropFilter setValue:mask forKey:@"inputMaskImage"];
  [self endContext:cropContext];
  return [cropFilter valueForKey:@"outputImage"];
}

- (CGContext *)openContext:(CGSize)size
{
  RNSVGUIGraphicsBeginImageContextWithOptions(size, NO, 1.0);
  CGContextRef cropContext = UIGraphicsGetCurrentContext();
#if TARGET_OS_OSX
  CGFloat scale = [RNSVGRenderUtils getScreenScale];
  CGContextScaleCTM(cropContext, scale, scale);
#else
  CGContextTranslateCTM(cropContext, 0, size.height);
  CGContextScaleCTM(cropContext, 1, -1);
#endif
  return cropContext;
}

- (void)endContext:(CGContext *)context
{
  RNSVGUIGraphicsEndImageContext();
}

- (CIImage *)getMaskFromRect:(CGContext *)context rect:(CGRect)rect ctm:(CGAffineTransform)ctm
{
  CGPathRef path = CGPathCreateWithRect(rect, nil);
  path = CGPathCreateCopyByTransformingPath(path, &ctm);

  CGContextSetRGBFillColor(context, 255, 255, 255, 255);
  CGContextAddPath(context, path);
  CGContextFillPath(context);

  CGImage *maskImage = CGBitmapContextCreateImage(context);
  CIImage *ciMaskImage = [CIImage imageWithCGImage:maskImage];
  CGImageRelease(maskImage);
  return ciMaskImage;
}

static CIFilter *sourceAlphaFilter()
{
  CIFilter *sourceAlpha = [CIFilter filterWithName:@"CIColorMatrix"];
  CGFloat zero[4] = {0, 0, 0, 0};
  [sourceAlpha setDefaults];
  [sourceAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputRVector"];
  [sourceAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputGVector"];
  [sourceAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBVector"];
  [sourceAlpha setValue:[CIVector vectorWithX:0.0 Y:0.0 Z:0.0 W:1.0] forKey:@"inputAVector"];
  [sourceAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBiasVector"];
  return sourceAlpha;
}

static CIImage *applySourceAlphaFilter(CIImage *inputImage)
{
  CIFilter *sourceAlpha = sourceAlphaFilter();
  [sourceAlpha setValue:inputImage forKey:@"inputImage"];
  return [sourceAlpha valueForKey:@"outputImage"];
}

- (RNSVGPlatformView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  return nil;
}

- (void)parseReference
{
  [self.svgView defineFilter:self filterName:self.name];
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

- (void)setFilterUnits:(RNSVGUnits)filterUnits
{
  if (filterUnits == _filterUnits) {
    return;
  }

  _filterUnits = filterUnits;
  [self invalidate];
}

- (void)setPrimitiveUnits:(RNSVGUnits)primitiveUnits
{
  if (primitiveUnits == _primitiveUnits) {
    return;
  }

  _primitiveUnits = primitiveUnits;
  [self invalidate];
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFilterCls(void)
{
  return RNSVGFilter.class;
}
#endif // RCT_NEW_ARCH_ENABLED

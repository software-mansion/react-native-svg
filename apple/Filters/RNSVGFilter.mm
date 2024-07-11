#import "RNSVGFilter.h"
#import "RNSVGFilterPrimitive.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import <react/renderer/components/view/conversions.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFilter {
  NSMutableDictionary<NSString *, CIImage *> *resultsMap;
}

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

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
  _x = nil;
  _y = nil;
  _height = nil;
  _width = nil;
  _filterUnits = kRNSVGUnitsObjectBoundingBox;
  _primitiveUnits = kRNSVGUnitsUserSpaceOnUse;
}
#endif // RCT_NEW_ARCH_ENABLED

- (id)init
{
  if (self = [super init]) {
    resultsMap = [NSMutableDictionary dictionary];
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

  CIImage *result = img;
  RNSVGFilterPrimitive *currentFilter;
  for (RNSVGNode *node in self.subviews) {
    if ([node isKindOfClass:[RNSVGFilterPrimitive class]]) {
      currentFilter = (RNSVGFilterPrimitive *)node;
      result = [currentFilter applyFilter:resultsMap previousFilterResult:result];
      if (currentFilter.result) {
        [resultsMap setObject:result forKey:currentFilter.result];
      }
    } else {
      RCTLogError(@"Invalid `Filter` subview: Filter children can only be `Fe...` components");
    }
  }

  return result;
  // TODO: Crop element to filter's x, y, width, height
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
  if ([x isEqualTo:_x]) {
    return;
  }

  _x = x;
  [self invalidate];
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

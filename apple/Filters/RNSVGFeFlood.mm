#import "RNSVGFeFlood.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import <react/renderer/components/view/conversions.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeFlood

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
    static const auto defaultProps = std::make_shared<const RNSVGFeColorMatrixProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeColorMatrixComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeColorMatrixProps &>(*props);

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeColorMatrixProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _floodColor = nil;
  _floodOpacity = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setFloodColor:(RNSVGBrush *)floodColor
{
  if (floodColor == _floodColor) {
    return;
  }
  [self invalidate];
  _floodColor = floodColor;
}

- (void)setFloodOpacity:(CGFloat)floodOpacity
{
  if (floodOpacity == _floodOpacity) {
    return;
  }
  [self invalidate];
  _floodOpacity = floodOpacity;
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  //    [CIImage imageWithColor:[self.floodColor ]];
  CIImage *res =
      [CIImage imageWithColor:[CIColor colorWithCGColor:[self.floodColor getColorWithOpacity:self.floodOpacity]]];
  return res;
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeFloodCls(void)
{
  return RNSVGFeFlood.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

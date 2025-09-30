#import "RNSVGFeFlood.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
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
    static const auto defaultProps = std::make_shared<const RNSVGFeFloodProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeFloodComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeFloodProps &>(*props);

  id floodColor = RNSVGConvertFollyDynamicToId(newProps.floodColor);
  if (floodColor != nil) {
    self.floodColor = [RCTConvert RNSVGBrush:floodColor];
  }
  self.floodOpacity = newProps.floodOpacity;

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeFloodProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _floodColor = nil;
  _floodOpacity = 1;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setFloodColor:(RNSVGBrush *)floodColor
{
  if (floodColor == _floodColor) {
    return;
  }
  _floodColor = floodColor;
  [self invalidate];
}

- (void)setFloodOpacity:(CGFloat)floodOpacity
{
  if (floodOpacity == _floodOpacity) {
    return;
  }
  _floodOpacity = floodOpacity;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  return [CIImage imageWithColor:[CIColor colorWithCGColor:[self.floodColor getColorWithOpacity:self.floodOpacity]]];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeFloodCls(void)
{
  return RNSVGFeFlood.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

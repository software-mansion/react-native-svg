#import "RNSVGFeTile.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeTile

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
    static const auto defaultProps = std::make_shared<const RNSVGFeTileProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeTileComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeTileProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeTileProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
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
  // TODO: implement applyFilter function
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeTileCls(void)
{
  return RNSVGFeTile.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

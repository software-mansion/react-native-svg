#import "RNSVGSvgViewAndroid.h"

#ifdef RN_FABRIC_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#endif // RN_FABRIC_ENABLED

@implementation RNSVGSvgViewAndroid

#ifdef RN_FABRIC_ENABLED
using namespace facebook::react;

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGSvgViewAndroidProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGSvgViewAndroidComponentDescriptor>();
}
#endif

@end

#ifdef RN_FABRIC_ENABLED
Class<RCTComponentViewProtocol> RNSVGSvgViewAndroidCls(void)
{
  return RNSVGSvgViewAndroid.class;
}
#endif // RN_FABRIC_ENABLED

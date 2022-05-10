#import "RNSVGCircleComponentView.h"
#import "RNSVGCircle.h"
#include "FabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGCircleComponentView {
    RNSVGCircle *_circle;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGCircleProps>();
    _props = defaultProps;
    _circle = [[RNSVGCircle alloc] init];
    self.contentView = _circle;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newCircleProps = *std::static_pointer_cast<const RNSVGCircleProps>(props);

    _circle.cx = [RNSVGLength lengthWithString:RCTNSStringFromString(newCircleProps.cx)];
    _circle.cy = [RNSVGLength lengthWithString:RCTNSStringFromString(newCircleProps.cy)];
    _circle.r  = [RNSVGLength lengthWithString:RCTNSStringFromString(newCircleProps.r)];
    setCommonRenderableProps(newCircleProps, _circle);
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _circle = [[RNSVGCircle alloc] init];
    self.contentView = _circle;
}

@end

Class<RCTComponentViewProtocol> RNSVGCircleCls(void)
{
  return RNSVGCircleComponentView.class;
}

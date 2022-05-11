#import "RNSVGCircleComponentView.h"
#import "RNSVGCircle.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGCircleComponentView {
    RNSVGCircle *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGCircleProps>();
    _props = defaultProps;
    _element = [[RNSVGCircle alloc] init];
    self.contentView = _element;
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
  const auto &newProps = *std::static_pointer_cast<const RNSVGCircleProps>(props);

    _element.cx = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.cx)];
    _element.cy = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.cy)];
    _element.r  = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.r)];
    setCommonRenderableProps(newProps, _element);
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGCircle alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGCircleCls(void)
{
  return RNSVGCircleComponentView.class;
}

#import "RNSVGLineComponentView.h"
#import "RNSVGLine.h"
#include "FabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGLineComponentView {
    RNSVGLine *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGLineProps>();
    _props = defaultProps;
    _element = [[RNSVGLine alloc] init];
    self.contentView = _element;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGLineComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGLineProps>(props);

    _element.x1 = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x1)];
    _element.y1 = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y1)];
    _element.x2  = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x2)];
    _element.y2  = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y2)];
    setCommonRenderableProps(newProps, _element);
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGLine alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGLineCls(void)
{
  return RNSVGLineComponentView.class;
}

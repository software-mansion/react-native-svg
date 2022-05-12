#import "RNSVGUseComponentView.h"
#import "RNSVGUse.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGUseComponentView {
    RNSVGUse *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGUseProps>();
    _props = defaultProps;
    _element = [[RNSVGUse alloc] init];
    self.contentView = _element;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGUseComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGUseProps>(props);

    setCommonRenderableProps(newProps, _element);

    _element.x = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x)];
    _element.y = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y)];
    if (RCTNSStringFromStringNilIfEmpty(newProps.useheight)) {
        _element.useheight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.useheight)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.usewidth)) {
        _element.usewidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.usewidth)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.height)) {
        _element.useheight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.height)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.width)) {
        _element.usewidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.width)];
    }

    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGUse alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGUseCls(void)
{
  return RNSVGUseComponentView.class;
}

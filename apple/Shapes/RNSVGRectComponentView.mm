#import "RNSVGRectComponentView.h"
#import "RNSVGRect.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGRectComponentView {
    RNSVGRect *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGRectProps>();
    _props = defaultProps;
    _element = [[RNSVGRect alloc] init];
    self.contentView = _element;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGRectComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGRectProps>(props);

    _element.x = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x)];
    _element.y = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y)];
    if (RCTNSStringFromStringNilIfEmpty(newProps.rectheight)) {
        _element.rectheight =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.rectheight)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.rectwidth)) {
        _element.rectwidth =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.rectwidth)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.height)) {
        _element.rectheight =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.height)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.width)) {
        _element.rectwidth =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.width)];
    }
    _element.rx = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.rx)];
    _element.ry = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.ry)];

    setCommonRenderableProps(newProps, _element, self);
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element.parentComponentView = nil;
    _element = [[RNSVGRect alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGRectCls(void)
{
  return RNSVGRectComponentView.class;
}

#import "RNSVGImageComponentView.h"
#import "RNSVGImage.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGImageComponentView {
    RNSVGImage *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGImageProps>();
    _props = defaultProps;
    _element = [[RNSVGImage alloc] init];
    self.contentView = _element;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGImageComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGImageProps>(props);

    setCommonRenderableProps(newProps, _element);
    _element.x = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x)];
    _element.y = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y)];
    if (RCTNSStringFromStringNilIfEmpty(newProps.imageheight)) {
        _element.imageheight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.imageheight)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.imagewidth)) {
        _element.imagewidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.imagewidth)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.height)) {
        _element.imageheight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.height)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.width)) {
        _element.imagewidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.width)];
    }
//    _element.src = newProps.src;
    _element.align = RCTNSStringFromStringNilIfEmpty(newProps.align);
    _element.meetOrSlice = intToRNSVGVBMOS(newProps.meetOrSlice);
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGImage alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGImageCls(void)
{
  return RNSVGImageComponentView.class;
}

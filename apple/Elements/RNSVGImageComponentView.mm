#import "RNSVGImageComponentView.h"
#import "RNSVGImage.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>
#import "RCTBridge.h"
#import "RCTImagePrimitivesConversions.h"
#import "RCTImageSource.h"

// Some RN private method hacking below similar to how it is done in RNScreens:
// https://github.com/software-mansion/react-native-screens/blob/90e548739f35b5ded2524a9d6410033fc233f586/ios/RNSScreenStackHeaderConfig.mm#L30
@interface RCTBridge (Private)
+ (RCTBridge *)currentBridge;
@end

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
    _element.bridge = [RCTBridge currentBridge];
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
    const auto &oldImageProps = *std::static_pointer_cast<const RNSVGImageProps>(oldProps);

    setCommonRenderableProps(newProps, _element, self);
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
    
    if (oldProps == nullptr || oldImageProps.src != newProps.src) {
        // TODO: make it the same as in e.g. slider
        NSURLRequest *request = NSURLRequestFromImageSource(newProps.src);
        CGSize size = RCTCGSizeFromSize(newProps.src.size);
        CGFloat scale = newProps.src.scale;
        RCTImageSource *imageSource = [[RCTImageSource alloc] initWithURLRequest:request size:size scale:scale];
        [_element setImageSrc:imageSource request:request];
    }
    _element.align = RCTNSStringFromStringNilIfEmpty(newProps.align);
    _element.meetOrSlice = intToRNSVGVBMOS(newProps.meetOrSlice);
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element.parentComponentView = nil;
    _element = [[RNSVGImage alloc] init];
    _element.bridge = [RCTBridge currentBridge];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGImageCls(void)
{
  return RNSVGImageComponentView.class;
}

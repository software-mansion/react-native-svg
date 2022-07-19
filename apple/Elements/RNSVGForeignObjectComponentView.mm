#import "RNSVGForeignObjectComponentView.h"
#import "RNSVGForeignObject.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGForeignObjectComponentView {
    RNSVGForeignObject *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGForeignObjectProps>();
    _props = defaultProps;
    _element = [[RNSVGForeignObject alloc] init];
    self.contentView = _element;
  }
  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    mountChildComponentView(childComponentView, index, _element);
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    unmountChildComponentView(childComponentView, index, _element);
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGForeignObjectComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGForeignObjectProps>(props);
    setCommonGroupProps(newProps, _element);

    _element.x =  RCTNSStringFromStringNilIfEmpty(newProps.x) ? [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x)] : nil;
    _element.y =  RCTNSStringFromStringNilIfEmpty(newProps.y) ? [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y)] : nil;
    if (RCTNSStringFromStringNilIfEmpty(newProps.foreignObjectheight)) {
        _element.foreignObjectheight =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.foreignObjectheight)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.foreignObjectwidth)) {
        _element.foreignObjectwidth =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.foreignObjectwidth)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.height)) {
        _element.foreignObjectheight =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.height)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.width)) {
        _element.foreignObjectwidth =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.width)];
    }
    
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGForeignObject alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGForeignObjectCls(void)
{
  return RNSVGForeignObjectComponentView.class;
}

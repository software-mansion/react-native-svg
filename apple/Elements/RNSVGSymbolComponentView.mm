#import "RNSVGSymbolComponentView.h"
#import "RNSVGSymbol.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGSymbolComponentView {
    RNSVGSymbol *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGSymbolProps>();
    _props = defaultProps;
    _element = [[RNSVGSymbol alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGSymbolComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGSymbolProps>(props);
    setCommonGroupProps(newProps, _element, self);

    _element.minX = newProps.minX;
    _element.minY = newProps.minY;
    _element.vbWidth = newProps.vbWidth;
    _element.vbHeight = newProps.vbHeight;
    _element.align = RCTNSStringFromStringNilIfEmpty(newProps.align);
    _element.meetOrSlice = intToRNSVGVBMOS(newProps.meetOrSlice);
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element.parentComponentView = nil;
    _element = [[RNSVGSymbol alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGSymbolCls(void)
{
  return RNSVGSymbolComponentView.class;
}

#import "RNSVGTextPathComponentView.h"
#import "RNSVGTextPath.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGTextPathComponentView {
    RNSVGTextPath *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGTextPathProps>();
    _props = defaultProps;
    _element = [[RNSVGTextPath alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGTextPathComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGTextPathProps>(props);

    setCommonRenderableProps(newProps, _element, self);
    _element.href = RCTNSStringFromStringNilIfEmpty(newProps.href);
    _element.side = RCTNSStringFromStringNilIfEmpty(newProps.side);
    _element.method = RCTNSStringFromStringNilIfEmpty(newProps.method);
    _element.midLine = RCTNSStringFromStringNilIfEmpty(newProps.midLine);
    _element.spacing = RCTNSStringFromStringNilIfEmpty(newProps.spacing);
    _element.startOffset = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.startOffset)];

    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element.parentComponentView = nil;
    _element = [[RNSVGTextPath alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGTextPathCls(void)
{
  return RNSVGTextPathComponentView.class;
}

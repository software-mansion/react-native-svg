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
    if ([childComponentView isKindOfClass:[RCTViewComponentView class]] && [((RCTViewComponentView *)childComponentView).contentView isKindOfClass:[RNSVGNode class]]) {
        [_element insertSubview:((RCTViewComponentView *)childComponentView).contentView atIndex:index];
        [_element invalidate];
    } else {
        [super mountChildComponentView:childComponentView index:index];
    }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if ([childComponentView isKindOfClass:[RCTViewComponentView class]] && [((RCTViewComponentView *)childComponentView).contentView isKindOfClass:[RNSVGNode class]]) {
        [childComponentView removeFromSuperview];
        [_element invalidate];
    } else {
        [super unmountChildComponentView:childComponentView index:index];
    }
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGTextPathComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGTextPathProps>(props);

    setCommonRenderableProps(newProps, _element);
    _element.href = RCTNSStringFromStringNilIfEmpty(newProps.href);
    _element.side = RCTNSStringFromStringNilIfEmpty(newProps.side);
    _element.method = RCTNSStringFromStringNilIfEmpty(newProps.method);
    _element.midLine = RCTNSStringFromStringNilIfEmpty(newProps.midLine);
    _element.spacing = RCTNSStringFromStringNilIfEmpty(newProps.spacing);
    _element.startOffset = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.spacing)];

    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGTextPath alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGTextPathCls(void)
{
  return RNSVGTextPathComponentView.class;
}

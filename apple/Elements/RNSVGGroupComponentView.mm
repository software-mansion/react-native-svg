#import "RNSVGGroupComponentView.h"
#import "RNSVGGroup.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation RNSVGGroupComponentView {
    RNSVGGroup *_group;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGGroupProps>();
    _props = defaultProps;
    _group = [[RNSVGGroup alloc] init];
    self.contentView = _group;
  }
  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if ([childComponentView isKindOfClass:[RCTViewComponentView class]] && [((RCTViewComponentView *)childComponentView).contentView isKindOfClass:[RNSVGNode class]]) {
        [_group insertSubview:((RCTViewComponentView *)childComponentView).contentView atIndex:index];
        [_group invalidate];
    } else {
        [super mountChildComponentView:childComponentView index:index];
    }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if ([childComponentView isKindOfClass:[RCTViewComponentView class]] && [((RCTViewComponentView *)childComponentView).contentView isKindOfClass:[RNSVGNode class]]) {
        [childComponentView removeFromSuperview];
        [_group invalidate];
    } else {
        [super unmountChildComponentView:childComponentView index:index];
    }
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGGroupComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [_group invalidate];
    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNSVGGroupCls(void)
{
  return RNSVGGroupComponentView.class;
}

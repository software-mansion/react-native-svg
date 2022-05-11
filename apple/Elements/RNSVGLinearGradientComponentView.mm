#import "RNSVGLinearGradientComponentView.h"
#import "RNSVGLinearGradient.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGLinearGradientComponentView {
    RNSVGLinearGradient *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGLinearGradientProps>();
    _props = defaultProps;
    _element = [[RNSVGLinearGradient alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGLinearGradientComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGLinearGradientProps>(props);
    setCommonNodeProps(newProps, _element);
        
    _element.x1 = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x1)];
    _element.y1 = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y1)];
    _element.x2 = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x2)];
    _element.y2 = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y2)];
    if (newProps.gradient.size() > 0) {
        NSMutableArray<NSNumber *> *gradientArray = [NSMutableArray new];
        for (auto number : newProps.gradient) {
            [gradientArray addObject:[NSNumber numberWithDouble:number]];
        }
        _element.gradient = gradientArray;
    }
    _element.gradientUnits = newProps.gradientUnits == 0 ? kRNSVGUnitsObjectBoundingBox : kRNSVGUnitsUserSpaceOnUse;
    if (newProps.gradientTransform.size() == 6) {
        _element.gradientTransform = CGAffineTransformMake(newProps.gradientTransform.at(0), newProps.gradientTransform.at(1), newProps.gradientTransform.at(2), newProps.gradientTransform.at(3), newProps.gradientTransform.at(4), newProps.gradientTransform.at(5));
    }

    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGLinearGradient alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGLinearGradientCls(void)
{
  return RNSVGLinearGradientComponentView.class;
}

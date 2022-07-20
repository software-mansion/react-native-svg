#import "RNSVGRadialGradientComponentView.h"
#import "RNSVGRadialGradient.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGRadialGradientComponentView {
    RNSVGRadialGradient *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGRadialGradientProps>();
    _props = defaultProps;
    _element = [[RNSVGRadialGradient alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGRadialGradientComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGRadialGradientProps>(props);
    setCommonNodeProps(newProps, _element, self);
        
    _element.fx = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.fx)];
    _element.fy = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.fy)];
    _element.cx = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.cx)];
    _element.cy = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.cy)];
    _element.rx = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.rx)];
    _element.ry = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.ry)];
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
    _element.parentComponentView = nil;
    _element = [[RNSVGRadialGradient alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGRadialGradientCls(void)
{
  return RNSVGRadialGradientComponentView.class;
}

#import "RNSVGMaskComponentView.h"
#import "RNSVGMask.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGMaskComponentView {
    RNSVGMask *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGMaskProps>();
    _props = defaultProps;
    _element = [[RNSVGMask alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGMaskComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGMaskProps>(props);
    setCommonGroupProps(newProps, _element, self);
    
    _element.x = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x)];
    _element.y = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y)];
    if (RCTNSStringFromStringNilIfEmpty(newProps.maskheight)) {
        _element.maskheight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.maskheight)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.maskwidth)) {
        _element.maskwidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.maskwidth)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.height)) {
        _element.maskheight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.height)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.width)) {
        _element.maskwidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.width)];
    }
    _element.maskUnits = newProps.maskUnits == 0 ? kRNSVGUnitsObjectBoundingBox : kRNSVGUnitsUserSpaceOnUse;
    _element.maskContentUnits = newProps.maskUnits == 0 ? kRNSVGUnitsObjectBoundingBox : kRNSVGUnitsUserSpaceOnUse;
    if (newProps.maskTransform.size() == 6) {
        _element.maskTransform = CGAffineTransformMake(newProps.maskTransform.at(0), newProps.maskTransform.at(1), newProps.maskTransform.at(2), newProps.maskTransform.at(3), newProps.maskTransform.at(4), newProps.maskTransform.at(5));
    }

    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element.parentComponentView = nil;
    _element = [[RNSVGMask alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGMaskCls(void)
{
  return RNSVGMaskComponentView.class;
}

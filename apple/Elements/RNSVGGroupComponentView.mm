#import "RNSVGGroupComponentView.h"
#import "RNSVGGroup.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

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
    const auto &newGroupProps = *std::static_pointer_cast<const RNSVGGroupProps>(props);
    _group.name =  RCTNSStringFromStringNilIfEmpty(newGroupProps.name);
    _group.opacity = newGroupProps.opacity;
    //    std::vector<Float> matrix{};
    // transfrom
    _group.mask =  RCTNSStringFromStringNilIfEmpty(newGroupProps.mask);
    _group.markerStart =  RCTNSStringFromStringNilIfEmpty(newGroupProps.markerStart);
    _group.markerMid =  RCTNSStringFromStringNilIfEmpty(newGroupProps.markerMid);
    _group.markerEnd =  RCTNSStringFromStringNilIfEmpty(newGroupProps.markerEnd);
    _group.clipPath =  RCTNSStringFromStringNilIfEmpty(newGroupProps.clipPath);
    _group.clipRule =  newGroupProps.clipRule == 0 ? kRNSVGCGFCRuleEvenodd : kRNSVGCGFCRuleNonzero;
    _group.responsible = newGroupProps.responsible;
    _group.display =  RCTNSStringFromStringNilIfEmpty(newGroupProps.display);
    //    RNSVGGroupFillStruct fill{};
    _group.fillOpacity = newGroupProps.fillOpacity;
    _group.fillRule = newGroupProps.fillRule == 0 ? kRNSVGCGFCRuleEvenodd : kRNSVGCGFCRuleNonzero;
//    RNSVGGroupStrokeStruct stroke{};
    _group.strokeOpacity = newGroupProps.strokeOpacity;
    _group.strokeWidth =  [RNSVGLength lengthWithString:RCTNSStringFromString(newGroupProps.strokeWidth)];
    _group.strokeLinecap = newGroupProps.strokeLinecap == 0 ? kCGLineCapButt : newGroupProps.strokeLinecap == 1 ? kCGLineCapRound : kCGLineCapSquare;
    _group.strokeLinejoin =  newGroupProps.strokeLinejoin == 0 ? kCGLineJoinMiter : newGroupProps.strokeLinejoin == 1 ? kCGLineJoinRound : kCGLineJoinBevel;
//    std::vector<std::string> strokeDasharray{};
    _group.strokeDashoffset = newGroupProps.strokeDashoffset;
    _group.strokeMiterlimit = newGroupProps.strokeMiterlimit;
    _group.vectorEffect = newGroupProps.vectorEffect == 0 ? kRNSVGVectorEffectDefault : newGroupProps.vectorEffect == 1 ? kRNSVGVectorEffectNonScalingStroke : newGroupProps.vectorEffect == 2 ? kRNSVGVectorEffectInherit : kRNSVGVectorEffectUri;
//    std::vector<std::string> propList{};
    if (RCTNSStringFromStringNilIfEmpty(newGroupProps.fontSize)) {
        _group.font = @{ @"fontSize": RCTNSStringFromString(newGroupProps.fontSize) };
    }
    if (RCTNSStringFromStringNilIfEmpty(newGroupProps.fontWeight)) {
        _group.font = @{ @"fontWeight": RCTNSStringFromString(newGroupProps.fontWeight) };
    }
//    RNSVGGroupFontStruct font{};

    // renderables dont want to apply layout props
//        [super updateProps:props oldProps:oldProps];
}

+ (RNSVGVBMOS)intToRNSVGVBMOS:(int)value
{
    switch (value) {
        case 0:
            return kRNSVGVBMOSMeet;
        case 1:
            return kRNSVGVBMOSSlice;
        case 2:
            return kRNSVGVBMOSNone;
        default:
            return kRNSVGVBMOSMeet;
    }
}

@end

Class<RCTComponentViewProtocol> RNSVGGroupCls(void)
{
  return RNSVGGroupComponentView.class;
}

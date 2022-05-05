#import "RNSVGSvgViewComponentView.h"
#import "RNSVGSvgView.h"
#import "RNSVGViewBox.h"
#import "RNSVGNode.h"
#import <React/RCTLog.h>

#import <react/renderer/components/rnsvg/Props.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGSvgViewComponentView {
    NSMutableDictionary<NSString *, RNSVGNode *> *_clipPaths;
    NSMutableDictionary<NSString *, RNSVGNode *> *_templates;
    NSMutableDictionary<NSString *, RNSVGPainter *> *_painters;
    NSMutableDictionary<NSString *, RNSVGNode *> *_markers;
    NSMutableDictionary<NSString *, RNSVGNode *> *_masks;
    CGAffineTransform _invviewBoxTransform;
    bool rendered;
    RNSVGSvgView *_svgView;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGSvgViewProps>();
    _props = defaultProps;
    _svgView = [[RNSVGSvgView alloc] initWithFrame:frame];
    self.contentView = _svgView;
  }
  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if ([childComponentView isKindOfClass:[RCTViewComponentView class]] && [((RCTViewComponentView *)childComponentView).contentView isKindOfClass:[RNSVGNode class]]) {
        [_svgView insertSubview:((RCTViewComponentView *)childComponentView).contentView atIndex:index];
        [_svgView invalidate];
    } else {
        [super mountChildComponentView:childComponentView index:index];
    }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if ([childComponentView isKindOfClass:[RCTViewComponentView class]] && [((RCTViewComponentView *)childComponentView).contentView isKindOfClass:[RNSVGNode class]]) {
        [childComponentView removeFromSuperview];
        [_svgView invalidate];
    } else {
        [super unmountChildComponentView:childComponentView index:index];
    }
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGSvgViewComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newSvgViewProps = *std::static_pointer_cast<const RNSVGSvgViewProps>(props);
    
    _svgView.minX = newSvgViewProps.minX;
    _svgView.minY = newSvgViewProps.minY;
    _svgView.vbWidth = newSvgViewProps.vbWidth;
    _svgView.vbHeight = newSvgViewProps.vbHeight;
    _svgView.align = RCTNSStringFromStringNilIfEmpty(newSvgViewProps.align);
    _svgView.meetOrSlice = [RNSVGSvgViewComponentView intToRNSVGVBMOS:newSvgViewProps.meetOrSlice];
    _svgView.tintColor = RCTUIColorFromSharedColor(newSvgViewProps.tintColor);
    _svgView.tintColor = RCTUIColorFromSharedColor(newSvgViewProps.color);

  [super updateProps:props oldProps:oldProps];
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

Class<RCTComponentViewProtocol> RNSVGSvgViewCls(void)
{
  return RNSVGSvgViewComponentView.class;
}

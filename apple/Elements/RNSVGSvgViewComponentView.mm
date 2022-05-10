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
    RNSVGSvgView *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGSvgViewProps>();
    _props = defaultProps;
    _element = [[RNSVGSvgView alloc] initWithFrame:frame];
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
  return concreteComponentDescriptorProvider<RNSVGSvgViewComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGSvgViewProps>(props);
    
    _element.minX = newProps.minX;
    _element.minY = newProps.minY;
    _element.vbWidth = newProps.vbWidth;
    _element.vbHeight = newProps.vbHeight;
    _element.align = RCTNSStringFromStringNilIfEmpty(newProps.align);
    _element.meetOrSlice = [RNSVGSvgViewComponentView intToRNSVGVBMOS:newProps.meetOrSlice];
    if (RCTUIColorFromSharedColor(newProps.tintColor)) {
        _element.tintColor = RCTUIColorFromSharedColor(newProps.tintColor);
    }
    if (RCTUIColorFromSharedColor(newProps.color)) {
        _element.tintColor = RCTUIColorFromSharedColor(newProps.color);
    }

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

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGSvgView alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGSvgViewCls(void)
{
  return RNSVGSvgViewComponentView.class;
}

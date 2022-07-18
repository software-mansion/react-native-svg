#import "RNSVGMarkerComponentView.h"
#import "RNSVGMarker.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGMarkerComponentView {
    RNSVGMarker *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGMarkerProps>();
    _props = defaultProps;
    _element = [[RNSVGMarker alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGMarkerComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGMarkerProps>(props);
    setCommonRenderableProps(newProps, _element);
    
    if (RCTNSStringFromStringNilIfEmpty(newProps.fontSize)) {
        _element.font = @{ @"fontSize": RCTNSStringFromString(newProps.fontSize) };
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.fontWeight)) {
        _element.font = @{ @"fontWeight": RCTNSStringFromString(newProps.fontWeight) };
    }
    NSDictionary *fontDict = parseFontStruct(newProps.font);
    if (fontDict.count > 0) {
        _element.font = fontDict;
    }
    
    _element.refX = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.refX)];
    _element.refY = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.refY)];
    _element.markerHeight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.markerHeight)];
    _element.markerWidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.markerWidth)];
    _element.markerUnits = RCTNSStringFromStringNilIfEmpty(newProps.markerUnits);
    _element.orient = RCTNSStringFromStringNilIfEmpty(newProps.orient);

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
    _element = [[RNSVGMarker alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGMarkerCls(void)
{
  return RNSVGMarkerComponentView.class;
}

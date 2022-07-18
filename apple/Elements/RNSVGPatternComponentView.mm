#import "RNSVGPatternComponentView.h"
#import "RNSVGPattern.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGPatternComponentView {
    RNSVGPattern *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGPatternProps>();
    _props = defaultProps;
    _element = [[RNSVGPattern alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGPatternComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGPatternProps>(props);
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
    _element.x = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x)];
    _element.y = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y)];
    if (RCTNSStringFromStringNilIfEmpty(newProps.patternheight)) {
        _element.patternheight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.patternheight)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.patternwidth)) {
        _element.patternwidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.patternwidth)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.height)) {
        _element.patternheight = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.height)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.width)) {
        _element.patternwidth = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.width)];
    }
    _element.patternUnits = newProps.patternUnits == 0 ? kRNSVGUnitsObjectBoundingBox : kRNSVGUnitsUserSpaceOnUse;
    _element.patternContentUnits = newProps.patternUnits == 0 ? kRNSVGUnitsObjectBoundingBox : kRNSVGUnitsUserSpaceOnUse;
    if (newProps.patternTransform.size() == 6) {
        _element.patternTransform = CGAffineTransformMake(newProps.patternTransform.at(0), newProps.patternTransform.at(1), newProps.patternTransform.at(2), newProps.patternTransform.at(3), newProps.patternTransform.at(4), newProps.patternTransform.at(5));
    }
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
    _element = [[RNSVGPattern alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGPatternCls(void)
{
  return RNSVGPatternComponentView.class;
}

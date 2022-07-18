#import "RNSVGTextComponentView.h"
#import "RNSVGText.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGTextComponentView {
    RNSVGText *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGTextProps>();
    _props = defaultProps;
    _element = [[RNSVGText alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGTextComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGTextProps>(props);

    setCommonRenderableProps(newProps, _element);
    // textAnchor is in props of VM but not available on component
    _element.deltaX = createLengthArrayFromStrings(newProps.dx);
    _element.deltaY = createLengthArrayFromStrings(newProps.dy);
    if (!newProps.positionX.empty()){
        _element.positionX = createLengthArrayFromStrings(newProps.positionX);
    }
    if (!newProps.positionY.empty()){
        _element.positionY = createLengthArrayFromStrings(newProps.positionY);
    }
    if (!newProps.x.empty()){
        _element.positionX = createLengthArrayFromStrings(newProps.x);
    }
    if (!newProps.y.empty()){
        _element.positionY = createLengthArrayFromStrings(newProps.y);
    }
    _element.rotate = createLengthArrayFromStrings(newProps.rotate);
    _element.inlineSize = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.inlineSize)];
    _element.textLength = [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.textLength)];
    _element.baselineShift = RCTNSStringFromStringNilIfEmpty(newProps.baselineShift);
    _element.lengthAdjust = RCTNSStringFromStringNilIfEmpty(newProps.lengthAdjust);
    _element.alignmentBaseline = RCTNSStringFromStringNilIfEmpty(newProps.alignmentBaseline);
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

    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGText alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGTextCls(void)
{
  return RNSVGTextComponentView.class;
}

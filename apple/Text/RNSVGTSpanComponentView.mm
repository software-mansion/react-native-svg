#import "RNSVGTSpanComponentView.h"
#import "RNSVGTSpan.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGTSpanComponentView {
    RNSVGTSpan *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGTSpanProps>();
    _props = defaultProps;
    _element = [[RNSVGTSpan alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGTSpanComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGTSpanProps>(props);

    setCommonGroupProps(newProps, _element, self);
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
    _element.content = RCTNSStringFromStringNilIfEmpty(newProps.content);

    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element.parentComponentView = nil;
    _element = [[RNSVGTSpan alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGTSpanCls(void)
{
  return RNSVGTSpanComponentView.class;
}

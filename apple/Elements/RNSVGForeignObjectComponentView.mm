#import "RNSVGForeignObjectComponentView.h"
#import "RNSVGForeignObject.h"
#import "FabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGForeignObjectComponentView {
    RNSVGForeignObject *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGForeignObjectProps>();
    _props = defaultProps;
    _element = [[RNSVGForeignObject alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGForeignObjectComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGForeignObjectProps>(props);
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

    _element.x =  RCTNSStringFromStringNilIfEmpty(newProps.x) ? [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.x)] : nil;
    _element.y =  RCTNSStringFromStringNilIfEmpty(newProps.y) ? [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.y)] : nil;
    if (RCTNSStringFromStringNilIfEmpty(newProps.foreignObjectheight)) {
        _element.foreignObjectheight =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.foreignObjectheight)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.foreignObjectwidth)) {
        _element.foreignObjectwidth =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.foreignObjectwidth)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.height)) {
        _element.foreignObjectheight =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.height)];
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.width)) {
        _element.foreignObjectwidth =  [RNSVGLength lengthWithString:RCTNSStringFromString(newProps.width)];
    }
    
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGForeignObject alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGForeignObjectCls(void)
{
  return RNSVGForeignObjectComponentView.class;
}

#import "RNSVGGroupComponentView.h"
#import "RNSVGGroup.h"
#import "FabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

using namespace facebook::react;

@implementation RNSVGGroupComponentView {
    RNSVGGroup *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGGroupProps>();
    _props = defaultProps;
    _element = [[RNSVGGroup alloc] init];
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
  return concreteComponentDescriptorProvider<RNSVGGroupComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<const RNSVGGroupProps>(props);
    setCommonRenderableProps(newProps, _element);
    
    if (RCTNSStringFromStringNilIfEmpty(newProps.fontSize)) {
        _element.font = @{ @"fontSize": RCTNSStringFromString(newProps.fontSize) };
    }
    if (RCTNSStringFromStringNilIfEmpty(newProps.fontWeight)) {
        _element.font = @{ @"fontWeight": RCTNSStringFromString(newProps.fontWeight) };
    }
    NSDictionary *fontDict = [RNSVGGroupComponentView parseFontStruct:newProps.font];
    if (fontDict.count > 0) {
        _element.font = fontDict;
    }
    [super updateProps:props oldProps:oldProps];
}

+ (NSDictionary *)parseFontStruct:(RNSVGGroupFontStruct)fontStruct
{
    NSMutableDictionary *fontDict = [NSMutableDictionary new];
    
    // TODO: do it better maybe
    addValueToDict(fontDict, fontStruct.fontStyle, @"fontStyle");
    addValueToDict(fontDict, fontStruct.fontVariant, @"fontVariant");
    addValueToDict(fontDict, fontStruct.fontWeight, @"fontWeight");
    addValueToDict(fontDict, fontStruct.fontStretch, @"fontStretch");
    addValueToDict(fontDict, fontStruct.fontSize, @"fontSize");
    addValueToDict(fontDict, fontStruct.fontFamily, @"fontFamily");
    addValueToDict(fontDict, fontStruct.textAnchor, @"textAnchor");
    addValueToDict(fontDict, fontStruct.textDecoration, @"textDecoration");
    addValueToDict(fontDict, fontStruct.letterSpacing, @"letterSpacing");
    addValueToDict(fontDict, fontStruct.wordSpacing, @"wordSpacing");
    addValueToDict(fontDict, fontStruct.kerning, @"kerning");
    addValueToDict(fontDict, fontStruct.fontFeatureSettings, @"fontFeatureSettings");
    addValueToDict(fontDict, fontStruct.fontVariantLigatures, @"fontVariantLigatures");
    addValueToDict(fontDict, fontStruct.fontVariationSettings, @"fontVariationSettings");
    return [NSDictionary dictionaryWithDictionary:fontDict];
}

void addValueToDict(NSMutableDictionary *dict, std::string value, NSString *key)
{
    NSString *valueOrNil = RCTNSStringFromStringNilIfEmpty(value);
    if (valueOrNil) {
        dict[key] = valueOrNil;
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element = [[RNSVGGroup alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGGroupCls(void)
{
  return RNSVGGroupComponentView.class;
}

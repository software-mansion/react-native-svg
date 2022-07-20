#import "RNSVGPathComponentView.h"
#import "RNSVGPath.h"
#import "RNSVGFabricConversions.h"

#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"
#import <react/renderer/components/view/conversions.h>

using namespace facebook::react;

@implementation RNSVGPathComponentView {
    RNSVGPath *_element;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGPathProps>();
    _props = defaultProps;
    _element = [[RNSVGPath alloc] init];
    self.contentView = _element;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGPathComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSVGPathProps>(props);
    setCommonRenderableProps(newProps, _element, self);
    
    _element.d = [[RNSVGPathParser alloc] initWithPathString: RCTNSStringFromString(newProps.d)];
    [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _element.parentComponentView = nil;
    _element = [[RNSVGPath alloc] init];
    self.contentView = _element;
}

@end

Class<RCTComponentViewProtocol> RNSVGPathCls(void)
{
  return RNSVGPathComponentView.class;
}

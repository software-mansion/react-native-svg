#import "RNSVGCircleComponentView.h"
#import "RNSVGCircle.h"
#import "RNSVGSolidColorBrush.h"
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation RNSVGCircleComponentView {
    RNSVGCircle *_circle;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGCircleProps>();
    _props = defaultProps;
    _circle = [[RNSVGCircle alloc] init];
    self.contentView = _circle;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGCircleComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newCircleProps = *std::static_pointer_cast<const RNSVGCircleProps>(props);

    [_circle setCx:[RNSVGLength lengthWithNumber:(CGFloat)newCircleProps.cx]];
    [_circle setCy:[RNSVGLength lengthWithNumber:(CGFloat)newCircleProps.cy]];
    [_circle setR:[RNSVGLength lengthWithNumber:(CGFloat)newCircleProps.r]];
    // TODO: do it better with RCTConvert
    [_circle setFill:[[RNSVGSolidColorBrush alloc] initWithNumber:[NSNumber numberWithInt:newCircleProps.fill]]];

    [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNSVGCircleCls(void)
{
  return RNSVGCircleComponentView.class;
}

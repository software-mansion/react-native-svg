#import "RNSVGCircleComponentView.h"
#import "RNSVGViewBox.h"
#import "RNSVGNode.h"
#import <React/RCTLog.h>

#import <react/renderer/components/rnsvg/Props.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation RNSVGCircleComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGCircleProps>();
    _props = defaultProps;
  }
  return self;
}

- (CGPathRef)getPath:(CGContextRef)context
{
    CGMutablePathRef path = CGPathCreateMutable();
    CGFloat cx = [self relativeOnWidth:self.cx];
    CGFloat cy = [self relativeOnHeight:self.cy];
    CGFloat r = [self relativeOnOther:self.r];
    CGPathAddArc(path, nil, cx, cy, r, 0, 2 * (CGFloat)M_PI, NO);
    return (CGPathRef)CFAutorelease(path);
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const RNSVGCircleProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const RNSVGCircleProps>(props);

  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNSVGCircleCls(void)
{
  return RNSVGCircleComponentView.class;
}

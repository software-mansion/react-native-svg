#import "RNSVGCircleComponentView.h"
#import "RNSVGCircle.h"
#import "RNSVGPainterBrush.h"
#import "RNSVGSolidColorBrush.h"
#import "RNSVGContextBrush.h"
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

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
    // TODO: DynamicColorIOS not working for some reason
    [_circle setFill:[RNSVGCircleComponentView RNSVGBrush:newCircleProps.fill]];
    [super updateProps:props oldProps:oldProps];
}

+ (RNSVGBrush *)RNSVGBrush:(facebook::react::RNSVGCircleFillStruct)fillObject
{
    int type = fillObject.type;

    switch (type) {
        case 0: // solid color
        {
            // These are probably expensive allocations since it's often the same value.
            // We should memoize colors but look ups may be just as expensive.
            RNSVGColor *color = RCTUIColorFromSharedColor(fillObject.value);
            return [[RNSVGSolidColorBrush alloc] initWithColor:color];
        }
        case 1: // brush
        {
            NSArray *arr = @[@(type), RCTNSStringFromString(fillObject.brushRef)];
            return [[RNSVGPainterBrush alloc] initWithArray:arr];
        }
        case 2: // currentColor
            return [[RNSVGBrush alloc] initWithArray:nil];
        case 3: // context-fill
            return [[RNSVGContextBrush alloc] initFill];
        case 4: // context-stroke
            return [[RNSVGContextBrush alloc] initStroke];
        default:
            RCTLogError(@"Unknown brush type: %d", type);
            return nil;
    }
}

@end

Class<RCTComponentViewProtocol> RNSVGCircleCls(void)
{
  return RNSVGCircleComponentView.class;
}

#import "RNSVGFeGaussianBlur.h"
#import "RNSVGRenderUtils.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import <react/renderer/components/view/conversions.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeGaussianBlur

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGFeGaussianBlurProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeGaussianBlurComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeGaussianBlurProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);
  self.stdDeviationX = [NSNumber numberWithFloat:newProps.stdDeviationX];
  self.stdDeviationY = [NSNumber numberWithFloat:newProps.stdDeviationY];
  self.edgeMode = [RNSVGConvert RNSVGEdgeModeFromCppEquivalent:newProps.edgeMode];

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeGaussianBlurProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _stdDeviationX = nil;
  _stdDeviationY = nil;
  _edgeMode = SVG_EDGEMODE_UNKNOWN;
}
#endif // RCT_NEW_ARCH_ENABLED

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  CIImage *inResults = self.in1 ? [results objectForKey:self.in1] : nil;
  CIImage *inputImage = inResults ? inResults : previous;

  if (!inputImage) {
    return nil;
  }

  // We need to multiply stdDeviation by screenScale to achive the same results as on web
  CGFloat screenScale = [RNSVGRenderUtils getScreenScale];

  CIFilter *filter = [CIFilter filterWithName:(_stdDeviationX == _stdDeviationY ? @"CIGaussianBlur" : @"CIMotionBlur")];
  [filter setDefaults];
  [filter setValue:inputImage forKey:@"inputImage"];
  [filter setValue:@([_stdDeviationX floatValue] * screenScale) forKey:@"inputRadius"];

  if (_stdDeviationX != _stdDeviationY) {
    // X axis
    [filter setValue:[NSNumber numberWithFloat:0] forKey:@"inputAngle"];
    // Y axis
    [filter setValue:[filter valueForKey:@"outputImage"] forKey:@"inputImage"];
    [filter setValue:@([_stdDeviationY floatValue] * screenScale) forKey:@"inputRadius"];
    [filter setValue:[NSNumber numberWithFloat:M_PI_2] forKey:@"inputAngle"];
  }

  return [filter valueForKey:@"outputImage"];
}

- (void)setIn1:(NSString *)in1
{
  if ([in1 isEqualToString:_in1]) {
    return;
  }

  _in1 = in1;
  [self invalidate];
}

- (void)setStdDeviationX:(NSNumber *)stdDeviationX
{
  if (stdDeviationX == _stdDeviationX) {
    return;
  }

  _stdDeviationX = stdDeviationX;
  [self invalidate];
}

- (void)setStdDeviationY:(NSNumber *)stdDeviationY
{
  if (stdDeviationY == _stdDeviationY) {
    return;
  }

  _stdDeviationY = stdDeviationY;
  [self invalidate];
}

- (void)setEdgeMode:(RNSVGEdgeMode)edgeMode
{
  if (edgeMode == _edgeMode) {
    return;
  }

  _edgeMode = edgeMode;
  [self invalidate];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeGaussianBlurCls(void)
{
  return RNSVGFeGaussianBlur.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

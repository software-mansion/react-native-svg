#import "RNSVGFeBlend.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeBlend

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGFeBlendProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeBlendComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeBlendProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);
  self.in2 = RCTNSStringFromStringNilIfEmpty(newProps.in2);
  self.mode = [RNSVGConvert RNSVGBlendModeFromCppEquivalent:newProps.mode];

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeBlendProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _in2 = nil;
  _mode = RNSVGBlendMode::SVG_FEBLEND_MODE_NORMAL;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setIn1:(NSString *)in1
{
  if ([in1 isEqualToString:_in1]) {
    return;
  }

  _in1 = in1;
  [self invalidate];
}

- (void)setIn2:(NSString *)in2
{
  if ([in2 isEqualToString:_in2]) {
    return;
  }

  _in2 = in2;
  [self invalidate];
}

- (void)setMode:(RNSVGBlendMode)mode
{
  if (mode == _mode) {
    return;
  }
  _mode = mode;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  CIImage *inResults1 = self.in1 ? [results objectForKey:self.in1] : nil;
  CIImage *inResults2 = self.in2 ? [results objectForKey:self.in2] : nil;
  CIImage *inputImage1 = inResults1 ? inResults1 : previous;
  CIImage *inputImage2 = inResults2 ? inResults2 : previous;

  CIFilter *filter = nil;

  switch (self.mode) {
    case SVG_FEBLEND_MODE_NORMAL:
      filter = [CIFilter filterWithName:@"CISourceOverCompositing"];
      break;
    case SVG_FEBLEND_MODE_MULTIPLY:
      filter = [CIFilter filterWithName:@"CIMultiplyBlendMode"];
      break;
    case SVG_FEBLEND_MODE_SCREEN:
      filter = [CIFilter filterWithName:@"CIScreenBlendMode"];
      break;
    case SVG_FEBLEND_MODE_DARKEN:
      filter = [CIFilter filterWithName:@"CIDarkenBlendMode"];
      break;
    case SVG_FEBLEND_MODE_LIGHTEN:
      filter = [CIFilter filterWithName:@"CILightenBlendMode"];
      break;
    default:
      return nil;
  }

  [filter setDefaults];
  [filter setValue:inputImage1 forKey:@"inputImage"];
  [filter setValue:inputImage2 forKey:@"inputBackgroundImage"];

  return [filter valueForKey:@"outputImage"];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeBlendCls(void)
{
  return RNSVGFeBlend.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

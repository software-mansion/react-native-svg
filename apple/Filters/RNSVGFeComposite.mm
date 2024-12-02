#import "RNSVGFeComposite.h"
#import "RNSVGArithmeticFilter.h"
#import "RNSVGCompositeXor.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import <react/renderer/components/view/conversions.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

static CIColorKernel *thresholdKernel;

@implementation RNSVGFeComposite

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
    static const auto defaultProps = std::make_shared<const RNSVGFeCompositeProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeCompositeComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeCompositeProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);
  self.in2 = RCTNSStringFromStringNilIfEmpty(newProps.in2);
  self.k1 = [NSNumber numberWithFloat:newProps.k1];
  self.k2 = [NSNumber numberWithFloat:newProps.k2];
  self.k3 = [NSNumber numberWithFloat:newProps.k3];
  self.k4 = [NSNumber numberWithFloat:newProps.k4];
  self.operator1 = [RNSVGConvert RNSVGRNSVGCompositeOperatorFromCppEquivalent:newProps.operator1];

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeCompositeProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _in2 = nil;
  _k1 = nil;
  _k2 = nil;
  _k3 = nil;
  _k4 = nil;
  _operator1 = RNSVGCompositeOperator::SVG_FECOMPOSITE_OPERATOR_UNKNOWN;
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

- (void)setK1:(NSNumber *)k1
{
  if (k1 == _k1) {
    return;
  }

  _k1 = k1;
  [self invalidate];
}

- (void)setK2:(NSNumber *)k2
{
  if (k2 == _k2) {
    return;
  }

  _k2 = k2;
  [self invalidate];
}

- (void)setK3:(NSNumber *)k3
{
  if (k3 == _k3) {
    return;
  }

  _k3 = k3;
  [self invalidate];
}

- (void)setK4:(NSNumber *)k4
{
  if (k4 == _k4) {
    return;
  }

  _k4 = k4;
  [self invalidate];
}

- (void)setOperator1:(RNSVGCompositeOperator)operator1
{
  if (operator1 == _operator1) {
    return;
  }

  _operator1 = operator1;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  CIImage *inResults1 = self.in1 ? [results objectForKey:self.in1] : nil;
  CIImage *inResults2 = self.in2 ? [results objectForKey:self.in2] : nil;
  CIImage *inputImage1 = inResults1 ? inResults1 : previous;
  CIImage *inputImage2 = inResults2 ? inResults2 : previous;

  CIFilter *filter = nil;

  switch (self.operator1) {
    case SVG_FECOMPOSITE_OPERATOR_OVER:
      filter = [CIFilter filterWithName:@"CISourceOverCompositing"];
      break;
    case SVG_FECOMPOSITE_OPERATOR_IN:
      filter = [CIFilter filterWithName:@"CISourceInCompositing"];
      break;
    case SVG_FECOMPOSITE_OPERATOR_OUT:
      filter = [CIFilter filterWithName:@"CISourceOutCompositing"];
      break;
    case SVG_FECOMPOSITE_OPERATOR_ATOP:
      filter = [CIFilter filterWithName:@"CISourceAtopCompositing"];
      break;
    case SVG_FECOMPOSITE_OPERATOR_XOR:
      filter = [[RNSVGCompositeXor alloc] init];
      break;
    case SVG_FECOMPOSITE_OPERATOR_ARITHMETIC:
      filter = [[RNSVGArithmeticFilter alloc] init];
      break;
    default:
      return nil;
  }

  [filter setDefaults];

  if (self.operator1 == SVG_FECOMPOSITE_OPERATOR_XOR) {
    [filter setValue:inputImage1 forKey:@"inputImage1"];
    [filter setValue:inputImage2 forKey:@"inputImage2"];
  } else if (self.operator1 == SVG_FECOMPOSITE_OPERATOR_ARITHMETIC) {
    [filter setValue:inputImage1 forKey:@"inputImage1"];
    [filter setValue:inputImage2 forKey:@"inputImage2"];
    [filter setValue:(self.k1 != nil ? self.k1 : @0) forKey:@"inputK1"];
    [filter setValue:(self.k2 != nil ? self.k2 : @0) forKey:@"inputK2"];
    [filter setValue:(self.k3 != nil ? self.k3 : @0) forKey:@"inputK3"];
    [filter setValue:(self.k4 != nil ? self.k4 : @0) forKey:@"inputK4"];
  } else {
    [filter setValue:inputImage1 forKey:@"inputImage"];
    [filter setValue:inputImage2 forKey:@"inputBackgroundImage"];
  }

  return [filter valueForKey:@"outputImage"];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeCompositeCls(void)
{
  return RNSVGFeComposite.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

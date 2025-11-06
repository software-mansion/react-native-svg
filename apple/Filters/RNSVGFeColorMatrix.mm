#import "RNSVGFeColorMatrix.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeColorMatrix

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
    static const auto defaultProps = std::make_shared<const RNSVGFeColorMatrixProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeColorMatrixComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeColorMatrixProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);
  if (newProps.values.size() > 0) {
    NSMutableArray<NSNumber *> *valuesArray = [NSMutableArray new];
    for (auto number : newProps.values) {
      [valuesArray addObject:[NSNumber numberWithFloat:number]];
    }
    self.values = valuesArray;
  }
  self.type = [RNSVGConvert RNSVGColorMatrixTypeFromCppEquivalent:newProps.type];

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeColorMatrixProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _values = nil;
  _type = RNSVGColorMatrixType::SVG_FECOLORMATRIX_TYPE_MATRIX;
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

- (void)setValues:(NSArray<NSNumber *> *)values
{
  if (values == _values) {
    return;
  }

  _values = values;
  [self invalidate];
}

- (void)setType:(RNSVGColorMatrixType)type
{
  if (type == _type) {
    return;
  }
  _type = type;
  [self invalidate];
}

#define deg2rad(degrees) ((M_PI * degrees) / 180)

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results previousFilterResult:(CIImage *)previous
{
  CIImage *inResults = self.in1 ? [results objectForKey:self.in1] : nil;
  CIImage *inputImage = inResults ? inResults : previous;

  CIFilter *filter = nil;
  NSArray<NSNumber *> *array = self.values;
  NSUInteger count = [array count];

  switch (self.type) {
    case SVG_FECOLORMATRIX_TYPE_UNKNOWN:
      return nil;
    case SVG_FECOLORMATRIX_TYPE_MATRIX: {
      if (count != 20) {
        return nil;
      }
      CGFloat v[20] = {0};
      for (NSUInteger i = 0; i < count; i++) {
        v[i] = (CGFloat)[array[i] doubleValue];
      }
      filter = [CIFilter filterWithName:@"CIColorMatrix"];
      [filter setDefaults];
      [filter setValue:[CIVector vectorWithX:v[0] Y:v[1] Z:v[2] W:v[3]] forKey:@"inputRVector"];
      [filter setValue:[CIVector vectorWithX:v[5] Y:v[6] Z:v[7] W:v[8]] forKey:@"inputGVector"];
      [filter setValue:[CIVector vectorWithX:v[10] Y:v[11] Z:v[12] W:v[13]] forKey:@"inputBVector"];
      [filter setValue:[CIVector vectorWithX:v[15] Y:v[16] Z:v[17] W:v[18]] forKey:@"inputAVector"];
      [filter setValue:[CIVector vectorWithX:v[4] Y:v[9] Z:v[14] W:v[19]] forKey:@"inputBiasVector"];
      break;
    }
    case SVG_FECOLORMATRIX_TYPE_SATURATE: {
      if (count != 1) {
        return nil;
      }
      float saturation = [array[0] floatValue];
      filter = [CIFilter filterWithName:@"CIColorControls"];
      [filter setDefaults];
      [filter setValue:[NSNumber numberWithFloat:saturation] forKey:@"inputSaturation"];
      break;
    }
    case SVG_FECOLORMATRIX_TYPE_HUEROTATE: {
      if (count != 1) {
        return nil;
      }
      double deg = [array[0] doubleValue];
      filter = [CIFilter filterWithName:@"CIHueAdjust"];
      [filter setDefaults];
      float radians = (float)deg2rad(deg);
      [filter setValue:[NSNumber numberWithFloat:radians] forKey:@"inputAngle"];
      break;
    }
    case SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA: {
      if (count != 0) {
        return nil;
      }
      filter = [CIFilter filterWithName:@"CIColorMatrix"];
      [filter setDefaults];
      CGFloat zero[4] = {0, 0, 0, 0};
      CGFloat alpha[4] = {0.2125, 0.7154, 0.0721, 0};
      [filter setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputRVector"];
      [filter setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputGVector"];
      [filter setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBVector"];
      [filter setValue:[CIVector vectorWithValues:alpha count:4] forKey:@"inputAVector"];
      [filter setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBiasVector"];
      break;
    }
    default:
      return nil;
  }

  [filter setValue:inputImage forKey:@"inputImage"];

  return [filter valueForKey:@"outputImage"];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeColorMatrixCls(void)
{
  return RNSVGFeColorMatrix.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

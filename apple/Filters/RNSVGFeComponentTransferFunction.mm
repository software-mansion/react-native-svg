#import "RNSVGFeComponentTransferFunction.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeComponentTransferFunction

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
    static const auto defaultProps = std::make_shared<const RNSVGFeComponentTransferFunctionProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeComponentTransferFunctionComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeComponentTransferFunctionProps &>(*props);

  self.type = [RNSVGConvert RNSVGComponentTransferFuncTypeFromCppEquivalent:newProps.type];
  self.channel = [RNSVGConvert RNSVGComponentTransferFuncChannelFromCppEquivalent:newProps.channel];
  
  id tableValues = RNSVGConvertFollyDynamicToId(newProps.tableValues);
  if (tableValues != nil) {
    self.tableValues = [RCTConvert RNSVGLengthArray:tableValues];
  }
  
  id slope = RNSVGConvertFollyDynamicToId(newProps.slope);
  if (slope != nil) {
    self.slope = [RCTConvert RNSVGLength:slope];
  }
  
  id intercept = RNSVGConvertFollyDynamicToId(newProps.intercept);
  if (intercept != nil) {
    self.intercept = [RCTConvert RNSVGLength:intercept];
  }
  
  id amplitude = RNSVGConvertFollyDynamicToId(newProps.amplitude);
  if (amplitude != nil) {
    self.amplitude = [RCTConvert RNSVGLength:amplitude];
  }
  
  id exponent = RNSVGConvertFollyDynamicToId(newProps.exponent);
  if (exponent != nil) {
    self.exponent = [RCTConvert RNSVGLength:exponent];
  }
  
  id offset = RNSVGConvertFollyDynamicToId(newProps.offset);
  if (offset != nil) {
    self.offset = [RCTConvert RNSVGLength:offset];
  }

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeComponentTransferFunctionProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _channel = RNSVGComponentTransferFuncChannel::SVG_FECOMPONENTTRANSFERFUNC_CHANNEL_UNKNOWN;
  _type = RNSVGComponentTransferFuncType::SVG_FECOMPONENTTRANSFERFUNC_TYPE_IDENTITY;
  _tableValues = nil;
  _slope = [RNSVGLength lengthWithNumber:1];
  _intercept = [RNSVGLength lengthWithNumber:0];
  _amplitude = [RNSVGLength lengthWithNumber:1];
  _exponent = [RNSVGLength lengthWithNumber:1];
  _offset = [RNSVGLength lengthWithNumber:0];
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setChannel:(RNSVGComponentTransferFuncChannel)channel
{
  if (channel == _channel) {
    return;
  }
  _channel = channel;
  [self invalidate];
}

- (void)setType:(RNSVGComponentTransferFuncType)type
{
  if (type == _type) {
    return;
  }
  _type = type;
  [self invalidate];
}

- (void)setTableValues:(NSArray<RNSVGLength *> *)tableValues
{
  if (tableValues == _tableValues) {
    return;
  }
  
  _tableValues = tableValues;
  [self invalidate];
}

- (void)setSlope:(RNSVGLength *)slope
{
  if ([slope isEqualTo:_slope]) {
    return;
  }
  
  _slope = slope;
  [self invalidate];
}

- (void)setIntercept:(RNSVGLength *)intercept
{
  if ([intercept isEqualTo:_intercept]) {
    return;
  }
  
  _intercept = intercept;
  [self invalidate];
}

- (void)setAmplitude:(RNSVGLength *)amplitude
{
  if ([amplitude isEqualTo:_amplitude]) {
    return;
  }
  
  _amplitude = amplitude;
  [self invalidate];
}

- (void)setExponent:(RNSVGLength *)exponent
{
  if ([exponent isEqualTo:_exponent]) {
    return;
  }
  
  _exponent = exponent;
  [self invalidate];
}

- (void)setOffset:(RNSVGLength *)offset
{
  if ([offset isEqualTo:_offset]) {
    return;
  }
  
  _offset = offset;
  [self invalidate];
}


- (double)apply:(double) C
{
  const double eps = 1e-12;
  double Cprime = C;

  switch (self.type) {
      case SVG_FECOMPONENTTRANSFERFUNC_TYPE_TABLE: {
          if (self.tableValues != nil && self.tableValues.count >= 2) {
              NSInteger n = self.tableValues.count - 1; // n intervals
              if (C >= 1.0 - eps) {
                  Cprime = self.tableValues[n].value;
              } else {
                  NSInteger k = (NSInteger)floor(C * (double)n);
                  k = MIN(MAX(k, 0), n - 1);
                  double vk  = self.tableValues[k].value;
                  double vk1 = self.tableValues[k + 1].value;
                  double regionStart = (double)k / (double)n;
                  double frac = (C - regionStart) * (double)n;
                  Cprime = vk + frac * (vk1 - vk);
              }
          }
          break;
      }

      case SVG_FECOMPONENTTRANSFERFUNC_TYPE_DISCRETE: {
          if (self.tableValues != nil && self.tableValues.count > 0) {
              NSInteger n = self.tableValues.count;
              if (C >= 1.0 - eps) {
                  Cprime = self.tableValues[n - 1].value;
              } else {
                  NSInteger k = (NSInteger)floor(C * (double)n);
                  k = MIN(MAX(k, 0), n - 1);
                  Cprime = self.tableValues[k].value;
              }
          }
          break;
      }

      case SVG_FECOMPONENTTRANSFERFUNC_TYPE_LINEAR: {
          Cprime = self.slope.value * C + self.intercept.value;
          break;
      }

      case SVG_FECOMPONENTTRANSFERFUNC_TYPE_GAMMA: {
          // use double pow for double args
          Cprime = self.amplitude.value * pow(C, self.exponent.value) + self.offset.value;
          break;
      }

      case SVG_FECOMPONENTTRANSFERFUNC_TYPE_IDENTITY:
      default:
          break;
  }

  // clamp to [0,1]
  return fmin(fmax(Cprime, 0.0), 1.0);
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeComponentTransferFunctionCls(void)
{
  return RNSVGFeComponentTransferFunction.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

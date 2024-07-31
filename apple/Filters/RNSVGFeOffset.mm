#import "RNSVGFeOffset.h"
#if TARGET_OS_OSX
#import "RNSVGRenderUtils.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnsvg/ComponentDescriptors.h>
#import <react/renderer/components/view/conversions.h>
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGFeOffset

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGFeOffsetProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeOffsetComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeOffsetProps &>(*props);

  self.in1 = RCTNSStringFromStringNilIfEmpty(newProps.in1);
  id dx = RNSVGConvertFollyDynamicToId(newProps.dx);
  if (dx != nil) {
    self.dx = [RCTConvert RNSVGLength:dx];
  }
  id dy = RNSVGConvertFollyDynamicToId(newProps.dy);
  if (dy != nil) {
    self.dy = [RCTConvert RNSVGLength:dy];
  }

  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeOffsetProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _in1 = nil;
  _dx = nil;
  _dy = nil;
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

- (void)setDx:(RNSVGLength *)dx
{
  if ([dx isEqualTo:_dx]) {
    return;
  }

  _dx = dx;
  [self invalidate];
}

- (void)setDy:(RNSVGLength *)dy
{
  if ([dy isEqualTo:_dy]) {
    return;
  }

  _dy = dy;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
                     ctm:(CGAffineTransform)ctm
{
  CIImage *inResults = self.in1 ? [results objectForKey:self.in1] : nil;
  CIImage *inputImage = inResults ? inResults : previous;

  if (!inputImage) {
    return nil;
  }

  CIFilter *filter = [CIFilter filterWithName:@"CIAffineTransform"];
  [filter setDefaults];
  [filter setValue:inputImage forKey:@"inputImage"];

  CGFloat dx = [self relativeOnWidth:self.dx];
  CGFloat dy = [self relativeOnWidth:self.dy];

  // reset ctm translation
  CGAffineTransform contextTransform = CGAffineTransformConcat(ctm, CGAffineTransformMakeTranslation(-ctm.tx, -ctm.ty));
#if !TARGET_OS_OSX // [macOS]
  CGPoint translate = CGPointMake(dx, dy);
#else
  CGPoint translate = CGPointMake(dx, -dy);
  CGFloat scale = [RNSVGRenderUtils getScreenScale];
  CGAffineTransform screenScaleCTM = CGAffineTransformMake(scale, 0, 0, scale, 0, 0);
  translate = CGPointApplyAffineTransform(translate, screenScaleCTM);
#endif
  translate = CGPointApplyAffineTransform(translate, contextTransform);
  CGAffineTransform transform = CGAffineTransformMakeTranslation(translate.x, translate.y);

  [filter setValue:[NSValue valueWithCGAffineTransform:transform] forKey:@"inputTransform"];

  return [filter valueForKey:@"outputImage"];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeOffsetCls(void)
{
  return RNSVGFeOffset.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGUse.h"
#import <React/RCTLog.h>
#import "RNSVGSymbol.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGUse

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
    static const auto defaultProps = std::make_shared<const RNSVGUseProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGUseComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGUseProps &>(*props);

  id x = RNSVGConvertFollyDynamicToId(newProps.x);
  if (x != nil) {
    self.x = [RCTConvert RNSVGLength:x];
  }
  id y = RNSVGConvertFollyDynamicToId(newProps.y);
  if (y != nil) {
    self.y = [RCTConvert RNSVGLength:y];
  }
  id useheight = RNSVGConvertFollyDynamicToId(newProps.height);
  if (useheight != nil) {
    self.useheight = [RCTConvert RNSVGLength:useheight];
  }
  id usewidth = RNSVGConvertFollyDynamicToId(newProps.width);
  if (usewidth != nil) {
    self.usewidth = [RCTConvert RNSVGLength:usewidth];
  }
  self.href = RCTNSStringFromStringNilIfEmpty(newProps.href);

  setCommonRenderableProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGUseProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _x = nil;
  _y = nil;
  _useheight = nil;
  _usewidth = nil;
  _href = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setHref:(NSString *)href
{
  if ([href isEqualToString:_href]) {
    return;
  }

  [self invalidate];
  _href = href;
}

- (void)setX:(RNSVGLength *)x
{
  if ([x isEqualTo:_x]) {
    return;
  }

  [self invalidate];
  _x = x;
}

- (void)setY:(RNSVGLength *)y
{
  if ([y isEqualTo:_y]) {
    return;
  }

  [self invalidate];
  _y = y;
}

- (void)setUsewidth:(RNSVGLength *)usewidth
{
  if ([usewidth isEqualTo:_usewidth]) {
    return;
  }

  [self invalidate];
  _usewidth = usewidth;
}

- (void)setUseheight:(RNSVGLength *)useheight
{
  if ([useheight isEqualTo:_useheight]) {
    return;
  }

  [self invalidate];
  _useheight = useheight;
}

- (void)renderLayerTo:(CGContextRef)context rect:(CGRect)rect
{
  CGContextTranslateCTM(context, [self relativeOnWidth:self.x], [self relativeOnHeight:self.y]);
  RNSVGNode *definedTemplate = [self.svgView getDefinedTemplate:self.href];
  if (definedTemplate) {
    [self beginTransparencyLayer:context];
    [self clip:context];

    if ([definedTemplate isKindOfClass:[RNSVGRenderable class]]) {
      [(RNSVGRenderable *)definedTemplate mergeProperties:self];
    }

    if ([definedTemplate class] == [RNSVGSymbol class]) {
      RNSVGSymbol *symbol = (RNSVGSymbol *)definedTemplate;
      [symbol renderSymbolTo:context
                       width:[self relativeOnWidth:self.usewidth]
                      height:[self relativeOnHeight:self.useheight]];
    } else {
      [definedTemplate renderTo:context rect:rect];
    }

    if ([definedTemplate isKindOfClass:[RNSVGRenderable class]]) {
      [(RNSVGRenderable *)definedTemplate resetProperties];
    }

    [self endTransparencyLayer:context];
  } else if (self.href) {
    // TODO: calling yellow box here
    RCTLogWarn(
        @"`Use` element expected a pre-defined svg template as `href` prop, template named: %@ is not defined.",
        self.href);
    return;
  } else {
    return;
  }
  CGRect bounds = definedTemplate.clientRect;
  self.clientRect = bounds;
  self.pathBounds = definedTemplate.pathBounds;

  CGAffineTransform current = CGContextGetCTM(context);
  CGAffineTransform svgToClientTransform = CGAffineTransformConcat(current, self.svgView.invInitialCTM);

  self.ctm = svgToClientTransform;
  self.screenCTM = current;

  CGPoint mid = CGPointMake(CGRectGetMidX(bounds), CGRectGetMidY(bounds));
  CGPoint center = CGPointApplyAffineTransform(mid, self.matrix);

  self.bounds = bounds;
  if (!isnan(center.x) && !isnan(center.y)) {
    self.center = center;
  }
  self.frame = bounds;
}

- (RNSVGPlatformView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  CGPoint transformed = CGPointApplyAffineTransform(point, self.invmatrix);
  RNSVGNode const *definedTemplate = [self.svgView getDefinedTemplate:self.href];
  if (event) {
    self.active = NO;
  } else if (self.active) {
    return self;
  }
  RNSVGPlatformView const *hitChild = [definedTemplate hitTest:transformed withEvent:event];
  if (hitChild) {
    self.active = YES;
    return self;
  }
  return nil;
}

- (CGPathRef)getPath:(CGContextRef)context
{
  CGAffineTransform transform =
      CGAffineTransformMakeTranslation([self relativeOnWidth:self.x], [self relativeOnHeight:self.y]);
  RNSVGNode const *definedTemplate = [self.svgView getDefinedTemplate:self.href];
  if (!definedTemplate) {
    return nil;
  }
  CGPathRef path = [definedTemplate getPath:context];
  return CGPathCreateCopyByTransformingPath(path, &transform);
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGUseCls(void)
{
  return RNSVGUse.class;
}
#endif // RCT_NEW_ARCH_ENABLED

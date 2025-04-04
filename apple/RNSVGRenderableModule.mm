/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRenderableModule.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import "RNSVGPathMeasure.h"
#import "RNSVGRenderable.h"

#import "RCTConvert+RNSVG.h"
#import "RNSVGCGFCRule.h"

@implementation RNSVGRenderableModule

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED
@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;
#endif // RCT_NEW_ARCH_ENABLED
@synthesize bridge = _bridge;

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isPointInFill : (nonnull NSNumber *)reactTag options : (NSDictionary *)options)
{
  RNSVGPlatformView *view = [self getRenderableView:reactTag];

  if (![view isKindOfClass:[RNSVGRenderable class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
    return [NSNumber numberWithBool:false];
  }
  if (options == nil) {
    RCTLogError(@"Invalid options given to isPointInFill, got: %@", options);
    return [NSNumber numberWithBool:false];
  }
  id xo = [options objectForKey:@"x"];
  id yo = [options objectForKey:@"y"];
  if (![xo isKindOfClass:NSNumber.class] || ![yo isKindOfClass:NSNumber.class]) {
    RCTLogError(@"Invalid x or y given to isPointInFill");
    return [NSNumber numberWithBool:false];
  }
  RNSVGRenderable *svg = (RNSVGRenderable *)view;
  CGFloat x = (CGFloat)[xo doubleValue];
  CGFloat y = (CGFloat)[yo doubleValue];
  CGPoint point = CGPointMake(x, y);
  RNSVGPlatformView *target = [svg hitTest:point withEvent:nil];
  BOOL hit = target != nil;
  return [NSNumber numberWithBool:hit];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isPointInStroke : (nonnull NSNumber *)reactTag options : (NSDictionary *)options)
{
  RNSVGPlatformView *view = [self getRenderableView:reactTag];

  if (![view isKindOfClass:[RNSVGRenderable class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
    return [NSNumber numberWithBool:false];
  }
  if (options == nil) {
    RCTLogError(@"Invalid options given to isPointInFill, got: %@", options);
    return [NSNumber numberWithBool:false];
  }
  id xo = [options objectForKey:@"x"];
  id yo = [options objectForKey:@"y"];
  if (![xo isKindOfClass:NSNumber.class] || ![yo isKindOfClass:NSNumber.class]) {
    RCTLogError(@"Invalid x or y given to isPointInFill");
    return [NSNumber numberWithBool:false];
  }
  RNSVGRenderable *svg = (RNSVGRenderable *)view;
  CGFloat x = (CGFloat)[xo doubleValue];
  CGFloat y = (CGFloat)[yo doubleValue];
  CGPoint point = CGPointMake(x, y);
  BOOL hit = CGPathContainsPoint(svg.strokePath, nil, point, NO);

  return [NSNumber numberWithBool:hit];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getTotalLength : (nonnull NSNumber *)reactTag)
{
  RNSVGPlatformView *view = [self getRenderableView:reactTag];

  if (![view isKindOfClass:[RNSVGRenderable class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
    return [NSNumber numberWithDouble:0];
  }

  RNSVGPathMeasure *measure = [[RNSVGPathMeasure alloc] init];
  RNSVGRenderable *svg = (RNSVGRenderable *)view;
  CGPathRef target = [svg getPath:nil];
  [measure extractPathData:target];

  return [NSNumber numberWithDouble:measure.pathLength];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getPointAtLength
                                       : (nonnull NSNumber *)reactTag options
                                       : (NSDictionary *)options)
{
  RNSVGPlatformView *view = [self getRenderableView:reactTag];

  if (![view isKindOfClass:[RNSVGRenderable class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
    return nil;
  }

  CGFloat position = (CGFloat)[[options objectForKey:@"length"] doubleValue];
  RNSVGPathMeasure *measure = [[RNSVGPathMeasure alloc] init];
  RNSVGRenderable *svg = (RNSVGRenderable *)view;
  CGPathRef target = [svg getPath:nil];
  [measure extractPathData:target];

  CGFloat x;
  CGFloat y;
  CGFloat angle;
  double midPoint = fmax(0, fmin(position, measure.pathLength));
  [measure getPosAndTan:&angle midPoint:midPoint x:&x y:&y];

  return @{@"x" : @(x), @"y" : @(y), @"angle" : @(angle)};
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getBBox : (nonnull NSNumber *)reactTag options : (NSDictionary *)options)
{
  RNSVGPlatformView *view = [self getRenderableView:reactTag];

  if (![view isKindOfClass:[RNSVGRenderable class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
    return nil;
  }

  RNSVGRenderable *svg = (RNSVGRenderable *)view;
  BOOL fill = [[options objectForKey:@"fill"] boolValue];
  BOOL stroke = [[options objectForKey:@"stroke"] boolValue];
  BOOL markers = [[options objectForKey:@"markers"] boolValue];
  BOOL clipped = [[options objectForKey:@"clipped"] boolValue];
  [svg getPath:nil];

  CGRect bounds = CGRectNull;
  if (fill && !CGRectIsEmpty(svg.fillBounds)) {
    bounds = CGRectUnion(bounds, svg.fillBounds);
  }
  if (stroke && !CGRectIsEmpty(svg.strokeBounds)) {
    bounds = CGRectUnion(bounds, svg.strokeBounds);
  }
  if (markers && !CGRectIsEmpty(svg.markerBounds)) {
    bounds = CGRectUnion(bounds, svg.markerBounds);
  }
  if (clipped) {
    CGPathRef clipPath = [svg getClipPath];
    CGRect clipBounds = CGPathGetPathBoundingBox(clipPath);
    if (clipPath && !CGRectIsEmpty(clipBounds)) {
      bounds = CGRectIntersection(bounds, clipBounds);
    }
  }
  if (CGRectIsNull(bounds)) {
    bounds = CGRectZero;
  }
  CGPoint origin = bounds.origin;
  CGSize size = bounds.size;
  return @{@"x" : @(origin.x), @"y" : @(origin.y), @"width" : @(size.width), @"height" : @(size.height)};
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCTM : (nonnull NSNumber *)reactTag)
{
  RNSVGPlatformView *view = [self getRenderableView:reactTag];

  if (![view isKindOfClass:[RNSVGRenderable class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
    return nil;
  }

  RNSVGRenderable *svg = (RNSVGRenderable *)view;
  CGAffineTransform ctm = svg.ctm;
  return @{@"a" : @(ctm.a), @"b" : @(ctm.b), @"c" : @(ctm.c), @"d" : @(ctm.d), @"e" : @(ctm.tx), @"f" : @(ctm.ty)};
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getScreenCTM : (nonnull NSNumber *)reactTag)
{
  RNSVGPlatformView *view = [self getRenderableView:reactTag];

  if (![view isKindOfClass:[RNSVGRenderable class]]) {
    RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
    return nil;
  }

  RNSVGRenderable *svg = (RNSVGRenderable *)view;
  CGAffineTransform ctm = svg.ctm;
  return @{@"a" : @(ctm.a), @"b" : @(ctm.b), @"c" : @(ctm.c), @"d" : @(ctm.d), @"e" : @(ctm.tx), @"f" : @(ctm.ty)};
}

- (void)getRawResource:(NSString *)name resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
}

- (RNSVGPlatformView *)getRenderableView:(NSNumber *)reactTag
{
  __block RNSVGPlatformView *view;
#ifdef RCT_NEW_ARCH_ENABLED
  dispatch_sync(dispatch_get_main_queue(), ^{
    view = [self.viewRegistry_DEPRECATED viewForReactTag:reactTag];
  });
#else
  dispatch_sync(dispatch_get_main_queue(), ^{
    view = [self.bridge.uiManager viewForReactTag:reactTag];
  });
#endif // RCT_NEW_ARCH_ENABLED
  return view;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeSvgRenderableModuleSpecJSI>(params);
}
#endif

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGGroup.h"
#import "RNSVGClipPath.h"
#import "RNSVGMask.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGGroup {
  RNSVGGlyphContext *_glyphContext;
}

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
    static const auto defaultProps = std::make_shared<const RNSVGGroupProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGGroupComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGGroupProps &>(*props);

  setCommonGroupProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGGroupProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _font = nil;
  _glyphContext = nil;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setFont:(NSDictionary *)font
{
  if (font == _font) {
    return;
  }

  [self invalidate];
  _font = font;
}

- (void)renderLayerTo:(CGContextRef)context rect:(CGRect)rect
{
  [self clip:context];
  [self setupGlyphContext:context];
  [self renderGroupTo:context rect:rect];
}

- (void)renderGroupTo:(CGContextRef)context rect:(CGRect)rect
{
  [self pushGlyphContext];

  __block CGRect bounds = CGRectNull;

  [self traverseSubviews:^(RNSVGView *node) {
    if ([node isKindOfClass:[RNSVGMask class]] || [node isKindOfClass:[RNSVGClipPath class]]) {
      // no-op
    } else if ([node isKindOfClass:[RNSVGNode class]]) {
      RNSVGNode *svgNode = (RNSVGNode *)node;
      if (svgNode.display && [@"none" isEqualToString:svgNode.display]) {
        return YES;
      }
      if (svgNode.responsible && !self.svgView.responsible) {
        self.svgView.responsible = YES;
      }

      if ([node isKindOfClass:[RNSVGRenderable class]]) {
        [(RNSVGRenderable *)node mergeProperties:self];
      }

      [svgNode renderTo:context rect:rect];

      CGRect nodeRect = svgNode.clientRect;
      if (!CGRectIsEmpty(nodeRect)) {
        bounds = CGRectUnion(bounds, nodeRect);
      }

      if ([node isKindOfClass:[RNSVGRenderable class]]) {
        [(RNSVGRenderable *)node resetProperties];
      }
    } else if ([node isKindOfClass:[RNSVGSvgView class]]) {
      RNSVGSvgView *svgView = (RNSVGSvgView *)node;
      CGFloat width = [self relativeOnWidth:svgView.bbWidth];
      CGFloat height = [self relativeOnHeight:svgView.bbHeight];
      CGRect svgViewRect = CGRectMake(0, 0, width, height);
      CGContextClipToRect(context, svgViewRect);
      [svgView drawToContext:context withRect:svgViewRect];
    } else {
      [node drawRect:rect];
    }

    return YES;
  }];
  CGPathRef path = [self getPath:context];
  [self setHitArea:path];
  if (!CGRectEqualToRect(bounds, CGRectNull)) {
    self.clientRect = bounds;
    self.fillBounds = CGPathGetPathBoundingBox(path);
    self.strokeBounds = CGPathGetPathBoundingBox(self.strokePath);
    self.pathBounds = CGRectUnion(self.fillBounds, self.strokeBounds);

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

  [self popGlyphContext];
}

- (void)setupGlyphContext:(CGContextRef)context
{
  CGRect clipBounds = CGContextGetClipBoundingBox(context);
#if TARGET_OS_OSX // [macOS
  RNSVGSvgView *svgView = [self svgView];
  if (svgView != nil && (clipBounds.origin.x < 0 || clipBounds.origin.y < 0)) {
    clipBounds = CGRectApplyAffineTransform([svgView boundingBox], [svgView getInvViewBoxTransform]);
  }
#endif // macOS]
  clipBounds = CGRectApplyAffineTransform(clipBounds, self.matrix);
  CGFloat width = CGRectGetWidth(clipBounds);
  CGFloat height = CGRectGetHeight(clipBounds);

  _glyphContext = [[RNSVGGlyphContext alloc] initWithWidth:width height:height];
}

- (RNSVGGlyphContext *)getGlyphContext
{
  return _glyphContext;
}

- (void)pushGlyphContext
{
  __typeof__(self) __weak weakSelf = self;
  [[self.textRoot getGlyphContext] pushContext:weakSelf font:self.font];
}

- (void)popGlyphContext
{
  [[self.textRoot getGlyphContext] popContext];
}

- (void)renderPathTo:(CGContextRef)context rect:(CGRect)rect
{
  [super renderLayerTo:context rect:rect];
}

- (CGPathRef)getPath:(CGContextRef)context
{
  CGPathRef cached = self.path;
  if (cached) {
    return cached;
  }
  CGMutablePathRef __block path = CGPathCreateMutable();
  [self traverseSubviews:^(RNSVGNode *node) {
    if ([node isKindOfClass:[RNSVGNode class]] && ![node isKindOfClass:[RNSVGMask class]]) {
      CGAffineTransform transform = node.matrix;
      CGPathAddPath(path, &transform, [node getPath:context]);
      CGPathAddPath(path, &transform, [node markerPath]);
      node.dirty = false;
    }
    return YES;
  }];

  cached = CGPathRetain((CGPathRef)CFAutorelease(path));
  self.path = cached;
  return cached;
}

- (RNSVGPlatformView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  CGPoint transformed = CGPointApplyAffineTransform(point, self.invmatrix);

  if (!CGRectContainsPoint(self.pathBounds, transformed)) {
    return nil;
  }

  if (self.clipPath) {
    RNSVGClipPath *clipNode = (RNSVGClipPath *)[self.svgView getDefinedClipPath:self.clipPath];
    if ([clipNode isSimpleClipPath]) {
      CGPathRef clipPath = [self getClipPath];
      if (clipPath && !CGPathContainsPoint(clipPath, nil, transformed, clipNode.clipRule == kRNSVGCGFCRuleEvenodd)) {
        return nil;
      }
    } else {
      RNSVGRenderable *clipGroup = (RNSVGRenderable *)clipNode;
      if (![clipGroup hitTest:transformed withEvent:event]) {
        return nil;
      }
    }
  }

  if (!event) {
    NSPredicate *const anyActive =
        [NSPredicate predicateWithFormat:@"self isKindOfClass: %@ AND active == TRUE", [RNSVGNode class]];
    NSArray *const filtered = [self.subviews filteredArrayUsingPredicate:anyActive];
    if ([filtered count] != 0) {
      return [filtered.lastObject hitTest:transformed withEvent:event];
    }
  }

  for (RNSVGView *node in [self.subviews reverseObjectEnumerator]) {
    if ([node isKindOfClass:[RNSVGNode class]]) {
      if ([node isKindOfClass:[RNSVGMask class]]) {
        continue;
      }
      RNSVGNode *svgNode = (RNSVGNode *)node;
      if (event) {
        svgNode.active = NO;
      }
      RNSVGPlatformView *hitChild = [svgNode hitTest:transformed withEvent:event];
      if (hitChild) {
        svgNode.active = YES;
        return (svgNode.responsible || (svgNode != hitChild)) ? hitChild : self;
      }
    } else if ([node isKindOfClass:[RNSVGSvgView class]]) {
      RNSVGSvgView *svgView = (RNSVGSvgView *)node;
      RNSVGPlatformView *hitChild = [svgView hitTest:transformed withEvent:event];
      if (hitChild) {
        return hitChild;
      }
    }
  }

  RNSVGPlatformView *hitSelf = [super hitTest:transformed withEvent:event];
  if (hitSelf) {
    return hitSelf;
  }

  return nil;
}

- (void)parseReference
{
  self.dirty = false;
  if (self.name) {
    __typeof__(self) __weak weakSelf = self;
    [self.svgView defineTemplate:weakSelf templateName:self.name];
  }

  [self traverseSubviews:^(RNSVGNode *node) {
    if ([node isKindOfClass:[RNSVGNode class]]) {
      [node parseReference];
    }
    return YES;
  }];
}

- (void)resetProperties
{
  [self traverseSubviews:^(__kindof RNSVGNode *node) {
    if ([node isKindOfClass:[RNSVGRenderable class]]) {
      [(RNSVGRenderable *)node resetProperties];
    }
    return YES;
  }];
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGGroupCls(void)
{
  return RNSVGGroup.class;
}
#endif // RCT_NEW_ARCH_ENABLED

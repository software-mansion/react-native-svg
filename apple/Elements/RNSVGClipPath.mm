/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGClipPath.h"
#import "RNSVGMask.h"

#import <React/RCTLog.h>

#include <vector>

typedef enum {
  RNSVGClipPathStrategyUnknown,
  RNSVGClipPathStrategyFast,
  RNSVGClipPathStrategyMask
} RNSVGClipPathStrategy;

// O(n²) overlap check threshold - assume overlap for larger child counts to avoid main thread stall
static const size_t kMaxOverlapCheckChildren = 100;

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSVGClipPath {
  RNSVGClipPathStrategy _clipPathStrategy;
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
    static const auto defaultProps = std::make_shared<const RNSVGClipPathProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGClipPathComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGClipPathProps &>(*props);
  setCommonNodeProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGClipPathProps const>(props);
}

- (void)prepareForRecycle
{
  _clipPathStrategy = RNSVGClipPathStrategyUnknown;
  [super prepareForRecycle];
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)invalidate
{
  _clipPathStrategy = RNSVGClipPathStrategyUnknown;
  [super invalidate];
}

- (void)parseReference
{
  self.dirty = false;
  [self.svgView defineClipPath:self clipPathName:self.name];
}

// Helper to traverse children and collect transformed bounds.
// Applies node.matrix to each child's path bounds, then calls block.
- (void)enumerateChildBounds:(CGContextRef)context block:(void (^)(CGRect bounds))block
{
  [self traverseSubviews:^(RNSVGNode *node) {
    if ([node isKindOfClass:[RNSVGNode class]] && ![node isKindOfClass:[RNSVGMask class]]) {
      CGPathRef nodePath = [node getPath:context];
      if (nodePath) {
        CGRect nodeBounds = CGPathGetBoundingBox(nodePath);
        nodeBounds = CGRectApplyAffineTransform(nodeBounds, node.matrix);
        block(nodeBounds);
      }
    }
    return YES;
  }];
}

- (BOOL)hasOverlappingChildren:(CGContextRef)context
{
  // Short-circuit O(n²): check each child against previous as we collect.
  // Returns YES on first overlap found, avoiding full collection.
  __block std::vector<CGRect> childBounds;
  __block BOOL foundOverlap = NO;

  [self traverseSubviews:^(RNSVGNode *node) {
    if ([node isKindOfClass:[RNSVGNode class]] && ![node isKindOfClass:[RNSVGMask class]]) {
      CGPathRef nodePath = [node getPath:context];
      if (nodePath) {
        // Guard against pathological cases - assume overlap for large child counts
        if (childBounds.size() >= kMaxOverlapCheckChildren) {
          foundOverlap = YES;
          return NO; // Stop iteration
        }

        CGRect nodeBounds = CGPathGetBoundingBox(nodePath);
        nodeBounds = CGRectApplyAffineTransform(nodeBounds, node.matrix);

        // Check against all previous bounds
        for (const CGRect &prev : childBounds) {
          if (CGRectIntersectsRect(nodeBounds, prev)) {
            foundOverlap = YES;
            return NO; // Stop iteration
          }
        }

        childBounds.push_back(nodeBounds);
      }
    }
    return YES;
  }];

  return foundOverlap;
}

- (BOOL)getUniformClipRule:(RNSVGCGFCRule *)outClipRule context:(CGContextRef)context
{
  __block BOOL firstChild = YES;
  __block RNSVGCGFCRule uniformRule = kRNSVGCGFCRuleNonzero;
  __block BOOL isUniform = YES;

  [self traverseSubviews:^(RNSVGNode *node) {
    if ([node isKindOfClass:[RNSVGNode class]] && ![node isKindOfClass:[RNSVGMask class]]) {
      CGPathRef nodePath = [node getPath:context];
      if (nodePath) {
        if (firstChild) {
          uniformRule = node.clipRule;
          firstChild = NO;
        } else if (node.clipRule != uniformRule) {
          isUniform = NO;
          return NO; // Stop iteration
        }
      }
    }
    return YES;
  }];

  // No children: return default (nonzero), considered "uniform"
  // Mixed rules: return NO
  if (isUniform) {
    *outClipRule = uniformRule;
    return YES;
  }
  return NO;
}

- (CGImageRef)createMask:(CGContextRef)context bounds:(CGRect *)outBounds
{
  // Calculate bounds of all ClipPath children in final coordinate space
  // (including both child transforms and clipPath's own transform)
  __block CGRect clipBounds = CGRectNull;
  CGAffineTransform clipPathTransform = self.matrix;

  [self enumerateChildBounds:context
                       block:^(CGRect bounds) {
                         // Apply clipPath's transform on top of child transform
                         bounds = CGRectApplyAffineTransform(bounds, clipPathTransform);
                         clipBounds = CGRectUnion(clipBounds, bounds);
                       }];

  if (outBounds) {
    *outBounds = clipBounds;
  }

  // Handle null or invalid bounds (guard against negative dimensions before size_t cast)
  if (CGRectIsNull(clipBounds) || clipBounds.size.width <= 0 || clipBounds.size.height <= 0) {
    RCTLogWarn(@"RNSVG: ClipPath bounds are empty or invalid, clipping will not be applied");
    return NULL;
  }

  // Create offscreen bitmap context for mask
  // Masks should be grayscale
  // Account for screen scale (retina) to avoid blocky edges
#if TARGET_OS_OSX
  CGFloat screenScale = [[NSScreen mainScreen] backingScaleFactor];
#else
  CGFloat screenScale = [[UIScreen mainScreen] scale];
#endif
  size_t width = (size_t)ceil(clipBounds.size.width * screenScale);
  size_t height = (size_t)ceil(clipBounds.size.height * screenScale);

  if (width == 0 || height == 0) {
    return NULL;
  }

  // Resolution scaling: limit maximum bitmap dimension to 2048px.
  // Rationale: A 2048x2048 grayscale (8-bit) bitmap = 4MB memory.
  // Larger masks risk memory pressure on low-end devices and offer
  // diminishing visual returns (masks are binary clip regions).
  // 2048px covers most use cases; scaling preserves aspect ratio.
  const size_t maxDimension = 2048;
  CGFloat scale = screenScale;
  if (width > maxDimension || height > maxDimension) {
    CGFloat scaleX = (CGFloat)maxDimension / width;
    CGFloat scaleY = (CGFloat)maxDimension / height;
    scale = screenScale * fmin(scaleX, scaleY);
    width = (size_t)ceil(clipBounds.size.width * scale);
    height = (size_t)ceil(clipBounds.size.height * scale);
  }

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceGray();
  CGContextRef bitmapContext = CGBitmapContextCreate(NULL, width, height, 8, width, colorSpace, kCGImageAlphaNone);
  CGColorSpaceRelease(colorSpace);

  if (!bitmapContext) {
    RCTLogWarn(
        @"RNSVG: Failed to create bitmap context for ClipPath mask (width=%zu, height=%zu), clipping will not be applied",
        width,
        height);
    return NULL;
  }

  // Set up coordinate system: scale and translate
  // Scale down if resolution was limited, then translate so clipBounds.origin is at (0,0)
  CGContextScaleCTM(bitmapContext, scale, scale);
  CGContextTranslateCTM(bitmapContext, -clipBounds.origin.x, -clipBounds.origin.y);

  // Clear to black (outside clip region)
  CGContextSetGrayFillColor(bitmapContext, 0.0, 1.0);
  CGContextFillRect(bitmapContext, clipBounds);

  // Render each child with its clipRule, filling with white (inside clip region)
  // Each fill UNIONs with previous via source-over blend mode
  CGContextSetGrayFillColor(bitmapContext, 1.0, 1.0);

  [self traverseSubviews:^(RNSVGNode *node) {
    if ([node isKindOfClass:[RNSVGNode class]] && ![node isKindOfClass:[RNSVGMask class]]) {
      CGPathRef nodePath = [node getPath:context];
      if (nodePath) {
        CGContextSaveGState(bitmapContext);

        // Apply clipPath's transform, then child's transform
        CGContextConcatCTM(bitmapContext, self.matrix);
        CGContextConcatCTM(bitmapContext, node.matrix);

        // Add path and fill according to node's clipRule
        CGContextAddPath(bitmapContext, nodePath);
        if (node.clipRule == kRNSVGCGFCRuleEvenodd) {
          CGContextEOFillPath(bitmapContext);
        } else {
          CGContextFillPath(bitmapContext);
        }

        CGContextRestoreGState(bitmapContext);
      }
    }
    return YES;
  }];

  // Create image from bitmap context
  CGImageRef maskImage = CGBitmapContextCreateImage(bitmapContext);
  CGContextRelease(bitmapContext);

  return maskImage;
}

- (BOOL)canUseFastPath:(CGContextRef)context clipRule:(RNSVGCGFCRule *)outClipRule
{
  if (_clipPathStrategy != RNSVGClipPathStrategyUnknown) {
    if (_clipPathStrategy == RNSVGClipPathStrategyFast) {
      if (outClipRule) {
        [self getUniformClipRule:outClipRule context:context];
      }
      return YES;
    }
    return NO;
  }

  // Check if clipPath is simple (single non-Group child)
  NSArray<RNSVGPlatformView *> *children = self.subviews;
  BOOL isSimple = (children.count == 1) && ([children[0] class] != [RNSVGGroup class]);

  // Check if children don't overlap
  BOOL hasOverlap = !isSimple && [self hasOverlappingChildren:context];

  // Check if all children have uniform clipRule
  RNSVGCGFCRule clipRule = kRNSVGCGFCRuleNonzero;
  BOOL isUniform = [self getUniformClipRule:&clipRule context:context];

  BOOL canUseFastPath = (isSimple || !hasOverlap) && isUniform;

  if (canUseFastPath) {
    _clipPathStrategy = RNSVGClipPathStrategyFast;
    if (outClipRule) {
      *outClipRule = clipRule;
    }
    return YES;
  } else {
    _clipPathStrategy = RNSVGClipPathStrategyMask;
    return NO;
  }
}

- (BOOL)containsPoint:(CGPoint)point inPath:(CGPathRef)clipPath context:(CGContextRef)context
{
  RNSVGCGFCRule clipRule = kRNSVGCGFCRuleNonzero;
  BOOL hasUniformRule = [self getUniformClipRule:&clipRule context:context];
  BOOL useEvenodd = hasUniformRule ? (clipRule == kRNSVGCGFCRuleEvenodd) : NO;
  return CGPathContainsPoint(clipPath, nil, point, useEvenodd);
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGClipPathCls(void)
{
  return RNSVGClipPath.class;
}
#endif // RCT_NEW_ARCH_ENABLED

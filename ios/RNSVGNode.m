/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGNode.h"

#import "RNSVGContainer.h"

@implementation RNSVGNode

- (void)insertSubview:(UIView *)subview atIndex:(NSInteger)index
{
    [self invalidate];
    [super insertSubview:subview atIndex:index];
}

- (void)removeFromSuperview
{
    [self invalidate];
    [super removeFromSuperview];
}

- (void)setOpacity:(CGFloat)opacity
{
    [self invalidate];
    _opacity = opacity;
}

- (void)setTransform:(CGAffineTransform)transform
{
    [self invalidate];
    super.transform = transform;
}

- (void)invalidate
{
    id<RNSVGContainer> container = (id<RNSVGContainer>)self.superview;
    [container invalidate];
}

- (void)renderTo:(CGContextRef)context
{
    float opacity = self.opacity;
    BOOL transparent = NO;
    if (opacity <= 0) {
        // Nothing to paint
        return;
    }
    if (opacity >= 1) {
        opacity = 1;
        transparent = YES;
    }

    // This needs to be painted on a layer before being composited.
    CGContextSaveGState(context);
    CGContextConcatCTM(context, self.transform);
    CGContextSetAlpha(context, opacity);
    if (transparent) {
        CGContextBeginTransparencyLayer(context, NULL);

    }
    [self renderLayerTo:context];
    if (transparent) {
        CGContextEndTransparencyLayer(context);
    }
    CGContextRestoreGState(context);
}

- (void)setClipPath:(CGPathRef)clipPath
{
    if (clipPath == _clipPath) {
        return;
    }
    [self invalidate];
    CGPathRelease(_clipPath);
    _clipPath = CGPathRetain(clipPath);
}


- (void)dealloc
{
    CGPathRelease(_clipPath);
}


- (void)renderLayerTo:(CGContextRef)context
{
    // abstract
}

- (void)clip:(CGContextRef)context
{
    if (self.clipPath) {
        CGContextAddPath(context, self.clipPath);
        if (self.clipRule == kRNSVGCGFCRuleEvenodd) {
            CGContextEOClip(context);
        } else {
            CGContextClip(context);
        }
    }
}

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRenderable.h"

@implementation RNSVGRenderable

- (id)init
{
    self = [super init];
    if (self) {
        _nodeArea = CGPathCreateMutable();
    }
    return self;
}

- (void)setFill:(RNSVGBrush *)fill
{
    [self invalidate];
    _fill = fill;
}

- (void)setStroke:(RNSVGBrush *)stroke
{
    [self invalidate];
    _stroke = stroke;
}

- (void)setStrokeWidth:(CGFloat)strokeWidth
{
    [self invalidate];
    _strokeWidth = strokeWidth;
}

- (void)setStrokeLinecap:(CGLineCap)strokeLinecap
{
    [self invalidate];
    _strokeLinecap = strokeLinecap;
}

- (void)setStrokeJoin:(CGLineJoin)strokeLinejoin
{
    [self invalidate];
    _strokeLinejoin = strokeLinejoin;
}

- (void)setStrokeDash:(RNSVGCGFloatArray)strokeDasharray
{
    if (strokeDasharray.array == _strokeDasharray.array) {
        return;
    }
    if (_strokeDasharray.array) {
        free(_strokeDasharray.array);
    }
    [self invalidate];
    _strokeDasharray = strokeDasharray;
}

- (void)setStrokeDashoffset:(CGFloat)strokeDashoffset
{
    [self invalidate];
    _strokeDashoffset = strokeDashoffset;
}

- (void)setStrokeMiterlimit:(CGFloat)strokeMiterlimit
{
    [self invalidate];
    _strokeMiterlimit = strokeMiterlimit;
}

- (void)dealloc
{
    CGPathRelease(_nodeArea);
    if (_strokeDasharray.array) {
        free(_strokeDasharray.array);
    }
}

- (void)renderTo:(CGContextRef)context
{
    if (self.opacity <= 0 || self.opacity >= 1 || (self.fill && self.stroke)) {
        // If we have both fill and stroke, we will need to paint this using normal compositing
        [super renderTo: context];
        return;
    }
    // This is a terminal with only one painting. Therefore we don't need to paint this
    // off-screen. We can just composite it straight onto the buffer.
    CGContextSaveGState(context);
    CGContextConcatCTM(context, self.transform);
    CGContextSetAlpha(context, self.opacity);
    [self renderLayerTo:context];
    CGContextRestoreGState(context);
}

// hitTest delagate
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    CGPathRef clipPath  = [self getClipPath];
    if (self.nodeArea != NULL && CGPathContainsPoint(self.nodeArea, nil, point, NO)) {
        if (clipPath == NULL) {
            return self;
        } else {
            return CGPathContainsPoint(clipPath, nil, point, NO) ? self : nil;
        }
    } else {
        return nil;
    }
}

- (void)renderLayerTo:(CGContextRef)context
{
    // abstract
}

@end

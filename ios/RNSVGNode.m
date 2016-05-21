/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGNode.h"
#import "RNSVGContainer.h"
#import "RNSVGClipPath.h"

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
    if (opacity == _opacity) {
        return;
    }
    
    if (opacity < 0) {
        opacity = 0;
    } else if (opacity > 1) {
        opacity = 1;
    }
    
    [self invalidate];
    _opacity = opacity;
}

- (void)setTrans:(CGAffineTransform)trans
{
    [self invalidate];
    super.transform = trans;
}

- (void)invalidate
{
    id<RNSVGContainer> container = (id<RNSVGContainer>)self.superview;
    [container invalidate];
}

- (void)renderTo:(CGContextRef)context
{
    float opacity = self.opacity;

    BOOL transparent = opacity < 1;
    
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
    if (_clipPath == clipPath) {
        return;
    }
    [self invalidate];
    CGPathRelease(_clipPath);
    _clipPath = CGPathRetain(clipPath);
}

- (CGPathRef)getPath: (CGContextRef) context
{
    // abstract
    return CGPathCreateMutable();
}

- (CGPathRef)getClipPath
{
    CGPathRef clipPath = nil;
    
    if (self.clipPath) {
        clipPath = self.clipPath;
    } else if (self.clipPathId) {
        clipPath = [[self getSvgView] getDefinedClipPath:self.clipPathId];
    }
    
    return clipPath;
}

- (void)clip:(CGContextRef)context
{
    CGPathRef clipPath  = [self getClipPath];
    
    if (clipPath != NULL) {
        CGContextAddPath(context, [self getClipPath]);
        if (self.clipRule == kRNSVGCGFCRuleEvenodd) {
            CGContextEOClip(context);
        } else {
            CGContextClip(context);
        }
    }
}


- (void)reactSetInheritedBackgroundColor:(UIColor *)inheritedBackgroundColor
{
    self.backgroundColor = inheritedBackgroundColor;
}

- (void)renderLayerTo:(CGContextRef)context
{
    // abstract
}

- (RNSVGSvgView *)getSvgView
{
    UIView *parent = self.superview;
    while ([parent class] != [RNSVGSvgView class]) {
        parent = parent.superview;
    }
    
    return (RNSVGSvgView *)parent;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event;
{
    // abstract
    return nil;
}

- (void)dealloc
{
    CGPathRelease(_clipPath);
}

@end

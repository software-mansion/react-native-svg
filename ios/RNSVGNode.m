/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGNode.h"
#import "RNSVGContainer.h"

static NSMutableDictionary *ClipPaths;

@implementation RNSVGNode
{
    NSString *definedClipPathId;
}

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
    
    if (opacity <= 0) {
        // Nothing to paint
        return;
    }

    BOOL transparent = opacity < 1;
    if (!transparent) {
        opacity = 1;
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
    if (_clipPath == clipPath) {
        return;
    }
    [self invalidate];
    CGPathRelease(_clipPath);
    _clipPath = CGPathRetain(clipPath);
}


-(void)defineClipPath:(CGPathRef)clipPath clipPathId:(NSString *)clipPathId
{
    if (clipPath == _clipPath) {
        return;
    }
    [self invalidate];
    CGPathRelease(_clipPath);
    _clipPath = CGPathRetain(clipPath);
    if (ClipPaths == NULL) {
        ClipPaths = [[NSMutableDictionary alloc] init];
    }
    definedClipPathId = clipPathId;
    [ClipPaths setValue:[NSValue valueWithPointer:_clipPath] forKey:clipPathId];
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
        clipPath = [[ClipPaths valueForKey:self.clipPathId] pointerValue];
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

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event;
{
    // abstract
    return nil;
}

- (void)dealloc
{
    CGPathRelease(_clipPath);
    if (definedClipPathId) {
        [ClipPaths removeObjectForKey:definedClipPathId];
    }
}

@end

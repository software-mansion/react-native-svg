/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGText.h"
#import "RNSVGTextPath.h"
#import <React/RCTFont.h>
#import <CoreText/CoreText.h>
#import "RNSVGGlyphContext.h"

@implementation RNSVGText

- (void)setTextAnchor:(RNSVGTextAnchor)textAnchor
{
    [self invalidate];
    _textAnchor = textAnchor;
}

- (void)renderLayerTo:(CGContextRef)context
{
    [self clip:context];
    CGContextSaveGState(context);
    
    CGPathRef path = [self getGroupPath:context];
    CGAffineTransform transform = [self getAlignTransform:path];
    CGContextConcatCTM(context, transform);
    [self renderGroupTo:context];
    [self releaseCachedPath];
    CGContextRestoreGState(context);
    
    
    CGPathRef transformedPath = CGPathCreateCopyByTransformingPath(path, &transform);
    [self setHitArea:transformedPath];
    CGPathRelease(transformedPath);
}

// release the cached CGPathRef for RNSVGTSpan
- (void)releaseCachedPath
{
    [self traverseSubviews:^BOOL(__kindof RNSVGNode *node) {
        RNSVGText *text = node;
        [text releaseCachedPath];
        return YES;
    }];
}

- (CGPathRef)getGroupPath:(CGContextRef)context
{
    [self pushGlyphContext];
    CGPathRef groupPath = [super getPath:context];
    [self popGlyphContext];
    
    return groupPath;
}

- (CGPathRef)getPath:(CGContextRef)context
{
    CGPathRef groupPath = [self getGroupPath:context];
    CGAffineTransform transform = [self getAlignTransform:groupPath];
    [self releaseCachedPath];
    
    return (CGPathRef)CFAutorelease(CGPathCreateCopyByTransformingPath(groupPath, &transform));
}

- (void)renderGroupTo:(CGContextRef)context
{
    [self pushGlyphContext];
    [super renderGroupTo:context];
    [self popGlyphContext];
}

- (CGAffineTransform)getAlignTransform:(CGPathRef)path
{
    CGFloat width = CGRectGetWidth(CGPathGetBoundingBox(path));
    CGFloat x = 0;
    
    switch ([self getComputedTextAnchor]) {
        case kRNSVGTextAnchorMiddle:
            x = -width / 2;
            break;
        case kRNSVGTextAnchorEnd:
            x = -width;
            break;
        default: ;
    }
    
    return CGAffineTransformMakeTranslation(x, 0);
}

- (RNSVGTextAnchor)getComputedTextAnchor
{
    RNSVGTextAnchor anchor = self.textAnchor;
    if (self.subviews.count > 0) {
        RNSVGText *child = [self.subviews firstObject];
        
        while (child.subviews.count && anchor == kRNSVGTextAnchorAuto) {
            anchor = child.textAnchor;
            child = [child.subviews firstObject];
        }
    }
    return anchor;
}

- (void)pushGlyphContext
{
    [[[self getTextRoot] getGlyphContext] pushContext:self.font
                                               deltaX:self.deltaX
                                               deltaY:self.deltaY
                                            positionX:self.positionX
                                            positionY:self.positionY];
}

- (void)popGlyphContext
{
    [[[self getTextRoot] getGlyphContext] popContext];
}

- (CTFontRef)getFontFromContext
{
    return [[[self getTextRoot] getGlyphContext] getGlyphFont];
}

- (CGPoint)getGlyphPointFromContext:(CGPoint)offset glyphWidth:(CGFloat)glyphWidth
{
    return [[[self getTextRoot] getGlyphContext] getNextGlyphPoint:(CGPoint)offset glyphWidth:glyphWidth];
}

@end

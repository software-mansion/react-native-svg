/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import "RNSVGTSpan.h"
#import "RNSVGBezierTransformer.h"
#import "RNSVGText.h"
#import "RNSVGTextPath.h"

@implementation RNSVGTSpan
{
    RNSVGBezierTransformer *_bezierTransformer;
}

- (void)renderLayerTo:(CGContextRef)context
{
    if (self.content) {
        [self renderPathTo:context];
    } else {
        [self clip:context];
        [self renderGroupTo:context];
    }
}

- (CGPathRef)getPath:(CGContextRef)context
{
    if (!self.content) {
        return [self getGroupPath:context];
    }
    [self setContextBoundingBox:CGContextGetClipBoundingBox(context)];

    [self initialTextPath];
    CGMutablePathRef path = CGPathCreateMutable();

    if ([self.content isEqualToString:@""]) {
        RNSVGGlyphPoint computedPoint = [self getComputedGlyphPoint:0 glyphOffset:CGPointZero];
        [self getTextRoot].lastX = computedPoint.x;
        [self getTextRoot].lastY = computedPoint.y;
        return path;
    }

    CTFontRef font = [self getComputedFont];
    // Create a dictionary for this font
    CFDictionaryRef attributes = (__bridge CFDictionaryRef)@{
                                                             (NSString *)kCTFontAttributeName: (__bridge id)font,
                                                             (NSString *)kCTForegroundColorFromContextAttributeName: @YES
                                                             };

    CFStringRef string = (__bridge CFStringRef)self.content;
    CFAttributedStringRef attrString = CFAttributedStringCreate(kCFAllocatorDefault, string, attributes);
    CTLineRef line = CTLineCreateWithAttributedString(attrString);

    CGMutablePathRef linePath = [self getLinePath:line];
    CGAffineTransform offset = CGAffineTransformMakeTranslation(0, _bezierTransformer ? 0 : CTFontGetSize(font) * 1.1);
    CGPathAddPath(path, &offset, linePath);

    // clean up
    CFRelease(attrString);
    CFRelease(line);
    CGPathRelease(linePath);
    [self resetTextPathAttributes];
    return (CGPathRef)CFAutorelease(path);
}

- (CGMutablePathRef)getLinePath:(CTLineRef)line
{
    CGAffineTransform upsideDown = CGAffineTransformMakeScale(1.0, -1.0);
    CGMutablePathRef path = CGPathCreateMutable();

    CFArrayRef glyphRuns = CTLineGetGlyphRuns(line);
    CTRunRef run = CFArrayGetValueAtIndex(glyphRuns, 0);

    CFIndex runGlyphCount = CTRunGetGlyphCount(run);
    CGPoint positions[runGlyphCount];
    CGGlyph glyphs[runGlyphCount];

    // Grab the glyphs, positions, and font
    CTRunGetPositions(run, CFRangeMake(0, 0), positions);
    CTRunGetGlyphs(run, CFRangeMake(0, 0), glyphs);
    CFDictionaryRef attributes = CTRunGetAttributes(run);

    CTFontRef runFont = CFDictionaryGetValue(attributes, kCTFontAttributeName);

    CGFloat lineStartX;
    RNSVGGlyphPoint computedPoint;
    for(CFIndex i = 0; i < runGlyphCount; i++) {
        computedPoint = [self getComputedGlyphPoint:i glyphOffset:positions[i]];

        if (!i) {
            lineStartX = computedPoint.x;
        }

        CGPathRef letter = CTFontCreatePathForGlyph(runFont, glyphs[i], nil);

        CGAffineTransform textPathTransform = [self getTextPathTransform:computedPoint.x];

        if ([RNSVGBezierTransformer hasReachedEnd:textPathTransform]) {
            break;
        } else if ([RNSVGBezierTransformer hasReachedStart:textPathTransform]) {
            continue;
        }

        CGAffineTransform transform;

        if (_bezierTransformer) {
            textPathTransform = CGAffineTransformConcat(CGAffineTransformMakeTranslation(0, computedPoint.y), textPathTransform);
            transform = CGAffineTransformScale(textPathTransform, 1.0, -1.0);
        } else {
            transform = CGAffineTransformTranslate(upsideDown, computedPoint.x, -computedPoint.y);
        }

        CGPathAddPath(path, &transform, letter);
        CGPathRelease(letter);
    }

    [self getTextRoot].lastX = computedPoint.x;

    return path;
}

- (void)initialTextPath
{
    __block RNSVGBezierTransformer *bezierTransformer;
    [self traverseTextSuperviews:^(__kindof RNSVGText *node) {
        if ([node class] == [RNSVGTextPath class]) {
            RNSVGTextPath *textPath = node;
            bezierTransformer = [node getBezierTransformer];
            return NO;
        }
        return YES;
    }];

    _bezierTransformer = bezierTransformer;
}

- (CGAffineTransform)getTextPathTransform:(CGFloat)distance
{
    if (_bezierTransformer) {
        return [_bezierTransformer getTransformAtDistance:distance];
    }

    return CGAffineTransformIdentity;

}

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import "RNSVGTSpan.h"
#import "RNSVGBezierPath.h"
#import "RNSVGText.h"

@implementation RNSVGTSpan

- (void)renderLayerTo:(CGContextRef)context
{
    if (self.content) {
        [self pathRenderLayerTo:context];
    } else {
        [super renderLayerTo:context];
    }
}

- (CGPathRef)getPath:(CGContextRef)context
{
    if (!self.content) {
        return [self getTextGroupPath:context];
    }
    [self setContextBoundingBox:CGContextGetClipBoundingBox(context)];
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
    CGAffineTransform offset = CGAffineTransformMakeTranslation(0, CTFontGetSize(font));
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
    for(CFIndex i = 0; i < runGlyphCount; i++) {
        RNSVGGlyphPoint computedPoint = [self getComputedGlyphPoint:i glyphOffset:positions[i]];
        if (!i) {
            lineStartX = computedPoint.x;
        }
        
        CGAffineTransform transform = CGAffineTransformTranslate(upsideDown, computedPoint.x, -computedPoint.y);
        CGPathRef letter = CTFontCreatePathForGlyph(runFont, glyphs[i], nil);
        CGPathAddPath(path, &transform, letter);
        CGPathRelease(letter);
    }
    
    [self getTextRoot].lastX = lineStartX + CGPathGetBoundingBox(path).size.width;
    return path;
}


@end

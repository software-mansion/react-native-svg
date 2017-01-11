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
    CGPathRef _cache;
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

- (void)releaseCachedPath
{
    CGPathRelease(_cache);
    _cache = nil;
}

- (CGPathRef)getPath:(CGContextRef)context
{
    if (_cache) {
        return _cache;
    }
    
    NSString *text = self.content;
    if (!text) {
        return [self getGroupPath:context];
    }
    
    [self setupTextPath];
    [self setContextBoundingBox:CGContextGetClipBoundingBox(context)];
    
    CGMutablePathRef path = CGPathCreateMutable();
    
    // append spacing
    text = [text stringByAppendingString:@" "];
    
    [self pushGlyphContext];
    CTFontRef font = [self getFontFromContext];
    
    // Create a dictionary for this font
    CFDictionaryRef attributes = (__bridge CFDictionaryRef)@{
                                                             (NSString *)kCTFontAttributeName: (__bridge id)font,
                                                             (NSString *)kCTForegroundColorFromContextAttributeName: @YES
                                                             };

    CFStringRef string = (__bridge CFStringRef)text;
    CFAttributedStringRef attrString = CFAttributedStringCreate(kCFAllocatorDefault, string, attributes);
    CTLineRef line = CTLineCreateWithAttributedString(attrString);

    CGMutablePathRef linePath = [self getLinePath:line];
    CGAffineTransform offset = CGAffineTransformMakeTranslation(0, _bezierTransformer ? 0 : CTFontGetSize(font) * 1.1);
    CGPathAddPath(path, &offset, linePath);
    
    _cache = CGPathRetain(CGPathCreateCopy(path));
    [self popGlyphContext];
    
    // clean up
    CFRelease(attrString);
    CFRelease(line);
    CGPathRelease(linePath);
    
    return (CGPathRef)CFAutorelease(path);
}

- (CGMutablePathRef)getLinePath:(CTLineRef)line
{
    CTRunRef run = CFArrayGetValueAtIndex(CTLineGetGlyphRuns(line), 0);

    CFIndex runGlyphCount = CTRunGetGlyphCount(run);
    CGPoint positions[runGlyphCount];
    CGGlyph glyphs[runGlyphCount];

    // Grab the glyphs, positions, and font
    CTRunGetPositions(run, CFRangeMake(0, 0), positions);
    CTRunGetGlyphs(run, CFRangeMake(0, 0), glyphs);
    CTFontRef runFont = CFDictionaryGetValue(CTRunGetAttributes(run), kCTFontAttributeName);

    CGPoint glyphPoint;
    CGMutablePathRef path = CGPathCreateMutable();
    
    for(CFIndex i = 0; i < runGlyphCount; i++) {
        CGPathRef letter = CTFontCreatePathForGlyph(runFont, glyphs[i], nil);
        
        glyphPoint = [self getGlyphPointFromContext:positions[i] glyphWidth:CGRectGetWidth(CGPathGetBoundingBox(letter))];
        
        CGAffineTransform textPathTransform = [self getTextPathTransform:glyphPoint.x];

        if ([RNSVGBezierTransformer hasReachedEnd:textPathTransform]) {
            break;
        } else if ([RNSVGBezierTransformer hasReachedStart:textPathTransform]) {
            continue;
        }

        CGAffineTransform transform;

        if (_bezierTransformer) {
            textPathTransform = CGAffineTransformConcat(CGAffineTransformMakeTranslation(0, glyphPoint.y), textPathTransform);
            transform = CGAffineTransformScale(textPathTransform, 1.0, -1.0);
        } else {
            transform = CGAffineTransformTranslate(CGAffineTransformMakeScale(1.0, -1.0), glyphPoint.x, -glyphPoint.y);
        }
        
        CGPathAddPath(path, &transform, letter);
        CGPathRelease(letter);
    }
    
    return path;
}

- (void)setupTextPath
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

- (void)traverseTextSuperviews:(BOOL (^)(__kindof RNSVGText *node))block
{
    RNSVGText *targetView = self;
    BOOL result = block(self);
    
    while (targetView && [targetView class] != [RNSVGText class] && result) {
        if (![targetView isKindOfClass:[RNSVGText class]]) {
            //todo: throw exception here
            break;
        }
        
        targetView = [targetView superview];
        result = block(targetView);
    }
}

- (CGAffineTransform)getTextPathTransform:(CGFloat)distance
{
    if (_bezierTransformer) {
        return [_bezierTransformer getTransformAtDistance:distance];
    }

    return CGAffineTransformIdentity;

}

@end

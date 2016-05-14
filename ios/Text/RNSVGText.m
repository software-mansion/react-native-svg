/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGText.h"

#import <CoreText/CoreText.h>

@implementation RNSVGText

static void RNSVGFreeTextFrame(RNSVGTextFrame frame)
{
    if (frame.count) {
        // We must release each line before freeing up this struct
        for (int i = 0; i < frame.count; i++) {
            CFRelease(frame.lines[i]);
        }
        free(frame.lines);
        free(frame.widths);
    }
}

- (void)setAlignment:(CTTextAlignment)alignment
{
    [self invalidate];
    _alignment = alignment;
}

- (void)setTextFrame:(RNSVGTextFrame)frame
{
    if (frame.lines != _textFrame.lines) {
        RNSVGFreeTextFrame(_textFrame);
    }
    [self invalidate];
    _textFrame = frame;
}

- (void)setPath:(CGPathRef)path
{
    if (path == _path) {
        return;
    }
    [self invalidate];
    CGPathRelease(_path);
    _path = CGPathRetain(path);
}

- (void)dealloc
{
    CGPathRelease(_path);
    RNSVGFreeTextFrame(_textFrame);
}

- (void)renderLayerTo:(CGContextRef)context
{
    self.d = [self getPath: context];
    [super renderLayerTo:context];
}

- (CGPathRef)getPath:(CGContextRef)context
{
    CGMutablePathRef path = CGPathCreateMutable();
    RNSVGTextFrame frame = self.textFrame;
    for (int i = 0; i < frame.count; i++) {
        CGFloat shift;
        CGFloat width = frame.widths[i];
        switch (self.alignment) {
            case kCTTextAlignmentRight:
                shift = width;
                break;
            case kCTTextAlignmentCenter:
                shift = width / 2;
                break;
            default:
                shift = 0;
                break;
        }
        // We should consider snapping this shift to device pixels to improve rendering quality
        // when a line has subpixel width.
        CGAffineTransform offset = CGAffineTransformMakeTranslation(-shift, frame.baseLine + frame.lineHeight * i + (self.path == NULL ? 0 : -frame.lineHeight));
        CGPathAddPath(path, &offset, [self setLinePath:frame.lines[i]]);
    }
    
    return path;
}

- (CGPathRef)setLinePath:(CTLineRef)line
{
    
    CGAffineTransform upsideDown = CGAffineTransformMakeScale(1.0, -1.0);
    CGMutablePathRef path = CGPathCreateMutable();
    RNSVGGlyphCache *cache = [[RNSVGGlyphCache alloc] init];
    CTLineGetGlyphRuns(line);
    CFArrayRef glyphRuns = CTLineGetGlyphRuns(line);
    CFIndex runCount = CFArrayGetCount(glyphRuns);
    CFIndex glyphIndex = 0;
    for(CFIndex i = 0; i < runCount; ++i)
    {
        
        // For each run, we need to get the glyphs, their font (to get the path) and their locations.
        CTRunRef run = CFArrayGetValueAtIndex(glyphRuns, i);
        CFIndex runGlyphCount = CTRunGetGlyphCount(run);
        CGPoint positions[runGlyphCount];
        CGGlyph glyphs[runGlyphCount];
        
        // Grab the glyphs, positions, and font
        CTRunGetPositions(run, CFRangeMake(0, 0), positions);
        CTRunGetGlyphs(run, CFRangeMake(0, 0), glyphs);
        CFDictionaryRef attributes = CTRunGetAttributes(run);
        CTFontRef runFont = CFDictionaryGetValue(attributes, kCTFontAttributeName);
        for(CFIndex j = 0; j < runGlyphCount; ++j, ++glyphIndex) {
            CGPathRef letter = [cache pathForGlyph:glyphs[j] fromFont:runFont];
            CGPoint point = positions[j];
            if (letter != NULL) {
                CGAffineTransform transform;
                
                // draw glyphs along path
                if (self.path != NULL) {
                    CGPoint slope;
                    CGRect bounding = CGPathGetBoundingBox(letter);
                    UIBezierPath* path = [UIBezierPath bezierPathWithCGPath:self.path];
                    CGFloat percentConsumed = (point.x + bounding.size.width) / path.length;
                    if (percentConsumed >= 1.0f) {
                        continue;
                    }
        
                    CGPoint targetPoint = [path pointAtPercent:percentConsumed withSlope: &slope];
                    float angle = atan(slope.y / slope.x); //  + M_PI;
                    if (slope.x < 0) angle += M_PI; // going left, update the angle
                    transform = CGAffineTransformMakeTranslation(targetPoint.x - bounding.size.width, targetPoint.y);
                    transform = CGAffineTransformRotate(transform, angle);
                    transform = CGAffineTransformScale(transform, 1.0, -1.0);
                } else {
                    transform = CGAffineTransformTranslate(upsideDown, point.x, point.y);
                }
                CGPathAddPath(path, &transform, letter);
            }
        }
    }
    
    return path;
}

@end

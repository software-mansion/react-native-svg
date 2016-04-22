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

- (void)setAlignment:(CTTextAlignment)alignment
{
    [self invalidate];
    _alignment = alignment;
}

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

- (void)setTextFrame:(RNSVGTextFrame)frame
{
    if (frame.lines != _textFrame.lines) {
        RNSVGFreeTextFrame(_textFrame);
    }
    [self invalidate];
    _textFrame = frame;
}

- (void)dealloc
{
    RNSVGFreeTextFrame(_textFrame);
}

- (void)renderLayerTo:(CGContextRef)context
{
    RNSVGTextFrame frame = self.textFrame;
    
    if ((!self.fill && !self.stroke) || !frame.count) {
        return;
    }
    
    // to-do: draw along a path
    // to-do: fill-rule
    // to-do: clip
    CGTextDrawingMode mode = kCGTextStroke;
    if (self.fill) {
        if ([self.fill applyFillColor:context]) {
            mode = kCGTextFill;
        } else {
            
            for (int i = 0; i < frame.count; i++) {
                CGContextSaveGState(context);
                // Inverse the coordinate space since CoreText assumes a bottom-up coordinate space
                CGContextScaleCTM(context, 1.0, -1.0);
                CGContextSetTextDrawingMode(context, kCGTextClip);
                [self renderLineTo:context atIndex:i];
                // Inverse the coordinate space back to the original before filling
                CGContextScaleCTM(context, 1.0, -1.0);
                [self.fill paint:context];
                // Restore the state so that the next line can be clipped separately
                CGContextRestoreGState(context);
            }
            
            if (!self.stroke) {
                return;
            }
        }
    }
    if (self.stroke) {
        if ([self.stroke applyStrokeColor:context] == NO) {
            [self.stroke paint:context];
        }
        
        CGContextSetLineWidth(context, self.strokeWidth);
        CGContextSetLineCap(context, self.strokeLinecap);
        CGContextSetLineJoin(context, self.strokeLinejoin);
        RNSVGCGFloatArray dash = self.strokeDash;
        if (dash.count) {
            CGContextSetLineDash(context, 0, dash.array, dash.count);
        }
        if (mode == kCGTextFill) {
            mode = kCGTextFillStroke;
        }
    }
    
    CGContextSetTextDrawingMode(context, mode);
    
    // Inverse the coordinate space since CoreText assumes a bottom-up coordinate space
    CGContextScaleCTM(context, 1.0, -1.0);
    for (int i = 0; i < frame.count; i++) {
        [self renderLineTo:context atIndex:i];
    }
}

- (void)renderLineTo:(CGContextRef)context atIndex:(int)index
{
    RNSVGTextFrame frame = self.textFrame;
    CGFloat shift;
    switch (self.alignment) {
        case kCTTextAlignmentRight:
            shift = frame.widths[index];
            break;
        case kCTTextAlignmentCenter:
            shift = (frame.widths[index] / 2);
            break;
        default:
            shift = 0;
            break;
    }
    // We should consider snapping this shift to device pixels to improve rendering quality
    // when a line has subpixel width.
    CGContextSetTextPosition(context, -shift, -frame.baseLine - frame.lineHeight * index);
    CTLineRef line = frame.lines[index];
    CTLineDraw(line, context);
}

@end

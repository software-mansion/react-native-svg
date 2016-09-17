/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGText.h"
#import "RNSVGBezierPath.h"
#import <CoreText/CoreText.h>

@implementation RNSVGText

- (void)setAlignment:(CTTextAlignment)alignment
{
    [self invalidate];
    _alignment = alignment;
}
//
//- (void)setTextFrame:(RNSVGTextFrame)textFrame
//{
//    RNSVGFreeTextFrame(_textFrame);
//    [self invalidate];
//    _textFrame = textFrame;
//}

- (void)setPath:(NSArray *)path
{
    if (path == _path) {
        return;
    }
    [self invalidate];
    _path = path;
}

//- (void)dealloc
//{
//    RNSVGFreeTextFrame(_textFrame);
//}

- (void)renderLayerTo:(CGContextRef)context
{
    CGFloat shift = [self getShift:context path:nil];
    // translate path by alignment offset
    CGContextSaveGState(context);
    CGContextConcatCTM(context, CGAffineTransformMakeTranslation(-shift, 0));
    [super renderLayerTo:context];
    CGContextRestoreGState(context);
}

- (CGPathRef)getPath:(CGContextRef)context
{
    
    CGMutablePathRef path = CGPathCreateMutable();
    CGPathRef collection = [super getPath:context];
    CGFloat shift = [self getShift:context path:collection];
    
    CGAffineTransform align = CGAffineTransformMakeTranslation(shift, 0);
    CGPathAddPath(path, &align, collection);
    CGPathRelease(collection);
    
    return (CGPathRef)CFAutorelease(path);
}

- (CGFloat)getShift:(CGContextRef)context path:(CGPathRef)path
{
    if (!path) {
        path = [super getPath:context];
    }
    
    CGFloat width = CGPathGetBoundingBox(path).size.width;
    CGFloat shift;
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
    
    return shift;
}

//- (CGPathRef)getPath:(CGContextRef)context
//{
//    CGMutablePathRef path = CGPathCreateMutable();
//    RNSVGTextFrame frame = self.textFrame;
//    for (int i = 0; i < frame.count; i++) {
//        CGFloat shift;
//        CGFloat width = frame.widths[i];
//        switch (self.alignment) {
//            case kCTTextAlignmentRight:
//                shift = width;
//                break;
//            case kCTTextAlignmentCenter:
//                shift = width / 2;
//                break;
//            default:
//                shift = 0;
//                break;
//        }
//        // We should consider snapping this shift to device pixels to improve rendering quality
//        // when a line has subpixel width.
//        CGAffineTransform offset = CGAffineTransformMakeTranslation(-shift, frame.baseLine + frame.lineHeight * i + (self.path ? -frame.lineHeight : 0));
//        
//        CGMutablePathRef line = [self setLinePath:frame.lines[i]];
//        CGPathAddPath(path, &offset, line);
//        CGPathRelease(line);
//    }
    
//    return (CGPathRef)CFAutorelease(path);
//}
@end

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

- (void)setPath:(NSArray *)path
{
    if (path == _path) {
        return;
    }
    [self invalidate];
    _path = path;
}

- (void)renderLayerTo:(CGContextRef)context
{
    CGFloat shift = [self getShift:context path:nil];
    // Translate path by alignment offset
    CGContextSaveGState(context);
    CGContextConcatCTM(context, CGAffineTransformMakeTranslation(-shift, 0));
    [super renderLayerTo:context];
    CGContextRestoreGState(context);
}

- (CGPathRef)getPath:(CGContextRef)context
{
    
    CGMutablePathRef path = CGPathCreateMutable();
    CGPathRef collection = [self getPathFromSuper:context];
    
    // get alignment shift and Translate CGPath by it.
    CGFloat shift = [self getShift:context path:collection];
    CGAffineTransform align = CGAffineTransformMakeTranslation(shift, 0);
    CGPathAddPath(path, &align, collection);
    CGPathRelease(collection);
    
    
    return (CGPathRef)CFAutorelease(path);
}

- (CGPathRef)getPathFromSuper:(CGContextRef)context
{
    CGPathRef path = [super getPath:context];
    // reset offsetX and offsetY
    self.offsetX = self.offsetY = 0;
    return path;
}

- (CGFloat)getShift:(CGContextRef)context path:(CGPathRef)path
{
    if (!path) {
        path = [self getPathFromSuper:context];
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

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGImage.h"
#import "RCTConvert+RNSVG.h"
#import "RCTLog.h"

@implementation RNSVGImage
{
    CGImageRef image;
}

- (void)setSrc:(id)src
{
    if (src == _src) {
        return;
    }
    _src = src;
    CGImageRelease(image);
    image = CGImageRetain([RCTConvert CGImage:src]);
    [self invalidate];
}

- (void)setX:(NSString *)x
{
    if (x == _x) {
        return;
    }
    [self invalidate];
    _x = x;
}

- (void)setY:(NSString *)y
{
    if (y == _y) {
        return;
    }
    [self invalidate];
    _y = y;
}

- (void)setWidth:(NSString *)width
{
    if (width == _width) {
        return;
    }
    [self invalidate];
    _width = width;
}

- (void)setHeight:(NSString *)height
{
    if (height == _height) {
        return;
    }
    [self invalidate];
    _height = height;
}

- (void)dealloc
{
    CGImageRelease(image);
}

- (void)renderLayerTo:(CGContextRef)context
{
    CGRect rect = [self getRect:context];
    // add hit area
    self.hitArea = CGPathCreateWithRect(rect, nil);
    [self clip:context];
    
    CGContextSaveGState(context);
    CGContextTranslateCTM(context, 0, rect.size.height);
    CGContextScaleCTM(context, 1.0, -1.0);
    CGContextDrawImage(context, rect, image);
    CGContextRestoreGState(context);
    
}

- (CGRect)getRect:(CGContextRef)context
{
    [self setBoundingBox:context];
    CGFloat x = [self getWidthRelatedValue:self.x];
    CGFloat y = [self getHeightRelatedValue:self.y];
    CGFloat width = [self getWidthRelatedValue:self.width];
    CGFloat height = [self getHeightRelatedValue:self.height];
    return CGRectMake(x, y, width, height);
}

- (CGPathRef)getPath:(CGContextRef)context
{
    return CGPathCreateWithRect([self getRect:context], nil);
}

@end

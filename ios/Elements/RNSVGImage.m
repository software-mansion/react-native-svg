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
    CGRect box = CGContextGetClipBoundingBox(context);
    float height = CGRectGetHeight(box);
    float width = CGRectGetWidth(box);
    
    RNSVGPercentageConverter* convert = [[RNSVGPercentageConverter alloc] init];
    CGFloat x = [convert stringToFloat:self.x relative:width offset:0];
    CGFloat y = [convert stringToFloat:self.y relative:height offset:0];
    CGFloat w = [convert stringToFloat:self.width relative:width offset:0];
    CGFloat h = [convert stringToFloat:self.height relative:height offset:0];
    
    // add hit area
    CGPathAddPath(self.nodeArea, nil, CGPathCreateWithRect(CGRectMake(x, y, w, h), nil));
    
    if (self.opacity == 0) {
        return;
    }
    
    [self clip:context];
    CGContextSaveGState(context);
    CGContextTranslateCTM(context, 0, h);
    CGContextScaleCTM(context, 1.0, -1.0);
    CGContextDrawImage(context, CGRectMake(x, -y, w, h), image);
    CGContextRestoreGState(context);
    
}

@end

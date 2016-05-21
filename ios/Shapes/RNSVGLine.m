/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGLine.h"
#import "RCTLog.h"

@implementation RNSVGLine

- (void)setX1:(NSString *)x1
{
    if (x1 == _x1) {
        return;
    }
    [self invalidate];
    _x1 = x1;
}

- (void)setY1:(NSString *)y1
{
    if (y1 == _y1) {
        return;
    }
    [self invalidate];
    _y1 = y1;
}

- (void)setX2:(NSString *)x2
{
    if (x2 == _x2) {
        return;
    }
    [self invalidate];
    _x2 = x2;
}

- (void)setY2:(NSString *)y2
{
    if (y2 == _y2) {
        return;
    }
    [self invalidate];
    _y2 = y2;
}

- (void)renderLayerTo:(CGContextRef)context
{
    self.d = [self getPath: context];
    [super renderLayerTo:context];
}

- (CGPathRef)getPath:(CGContextRef)context
{

    CGMutablePathRef path = CGPathCreateMutable();
    CGRect box = CGContextGetClipBoundingBox(context);
    float height = CGRectGetHeight(box);
    float width = CGRectGetWidth(box);
    
    RNSVGPercentageConverter* convert = [[RNSVGPercentageConverter alloc] init];
    CGFloat x1 = [convert stringToFloat:self.x1 relative:width offset:0];
    CGFloat y1 = [convert stringToFloat:self.y1 relative:height offset:0];
    CGFloat x2 = [convert stringToFloat:self.x2 relative:width offset:0];
    CGFloat y2 = [convert stringToFloat:self.y2 relative:height offset:0];
    CGPathMoveToPoint(path, nil, x1, y1);
    CGPathAddLineToPoint(path, nil, x2, y2);
    
    return path;
}

@end

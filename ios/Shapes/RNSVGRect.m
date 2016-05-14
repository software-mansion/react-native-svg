/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRect.h"
#import "RCTLog.h"

@implementation RNSVGRect

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

- (void)setRx:(NSString *)rx
{
    if (rx == _rx) {
        return;
    }
    [self invalidate];
    _rx = rx;
}

- (void)setRy:(NSString *)ry
{
    if (ry == _ry) {
        return;
    }
    [self invalidate];
    _ry = ry;
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
    CGFloat x = [convert stringToFloat:self.x relative:width offset:0];
    CGFloat y = [convert stringToFloat:self.y relative:height offset:0];
    CGFloat w = [convert stringToFloat:self.width relative:width offset:0];
    CGFloat h = [convert stringToFloat:self.height relative:height offset:0];
    CGFloat rx = [convert stringToFloat:self.rx relative:width offset:0];
    CGFloat ry = [convert stringToFloat:self.ry relative:height offset:0];
    
    
    if (rx != 0 || ry != 0) {
        if (rx == 0) {
            rx = ry;
        } else if (ry == 0) {
            ry = rx;
        }
        
        if (rx > w / 2) {
            rx = w / 2;
        }
        
        if (ry > h / 2) {
            ry = h / 2;
        }
        
        CGPathAddRoundedRect(path, nil, CGRectMake(x, y, w, h), rx, ry);
    } else {
        CGPathAddRect(path, nil, CGRectMake(x, y, w, h));
    }
    
    return path;
}

@end

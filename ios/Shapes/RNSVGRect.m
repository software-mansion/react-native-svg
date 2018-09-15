/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRect.h"
#import <React/RCTLog.h>

@implementation RNSVGRect

- (void)setX:(NSString *)x
{
    if ([x isEqualToString:_x]) {
        return;
    }
    [self invalidate];
    _x = x;
}

- (void)setY:(NSString *)y
{
    if ([y isEqualToString:_y]) {
        return;
    }
    [self invalidate];
    _y = y;
}

- (void)setRectwidth:(NSString *)rectwidth
{
    if ([rectwidth isEqualToString:_rectwidth]) {
        return;
    }
    [self invalidate];
    _rectwidth = rectwidth;
}

- (void)setRectheight:(NSString *)rectheight
{
    if ([rectheight isEqualToString:_rectheight]) {
        return;
    }
    [self invalidate];
    _rectheight = rectheight;
}

- (void)setRx:(NSString *)rx
{
    if ([rx isEqualToString:_rx]) {
        return;
    }
    [self invalidate];
    _rx = rx;
}

- (void)setRy:(NSString *)ry
{
    if ([ry isEqualToString:_ry]) {
        return;
    }
    [self invalidate];
    _ry = ry;
}

- (CGPathRef)getPath:(CGContextRef)context
{
    CGMutablePathRef path = CGPathCreateMutable();
    CGFloat x = [self relativeOnWidth:self.x];
    CGFloat y = [self relativeOnHeight:self.y];
    CGFloat width = [self relativeOnWidth:self.rectwidth];
    CGFloat height = [self relativeOnHeight:self.rectheight];
    CGFloat rx = [self relativeOnWidth:self.rx];
    CGFloat ry = [self relativeOnHeight:self.ry];

    if (rx != 0 || ry != 0) {
        if (rx == 0) {
            rx = ry;
        } else if (ry == 0) {
            ry = rx;
        }

        if (rx > width / 2) {
            rx = width / 2;
        }

        if (ry > height / 2) {
            ry = height / 2;
        }

        CGPathAddRoundedRect(path, nil, CGRectMake(x, y, width, height), rx, ry);
    } else {
        CGPathAddRect(path, nil, CGRectMake(x, y, width, height));
    }

    return (CGPathRef)CFAutorelease(path);
}

@end

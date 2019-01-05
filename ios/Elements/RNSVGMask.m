/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGMask.h"
#import "RNSVGPainter.h"
#import "RNSVGBrushType.h"
#import "RNSVGNode.h"

@implementation RNSVGMask

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (void)parseReference
{
    [self.svgView defineMask:self maskName:self.name];
}

- (void)setX:(RNSVGLength *)x
{
    if ([x isEqualTo:_x]) {
        return;
    }

    _x = x;
    [self invalidate];
}

- (void)setY:(RNSVGLength *)y
{
    if ([y isEqualTo:_y]) {
        return;
    }

    _y = y;
    [self invalidate];
}

- (void)setWidth:(RNSVGLength *)width
{
    if ([width isEqualTo:_width]) {
        return;
    }

    _width = width;
    [self invalidate];
}

- (void)setHeight:(RNSVGLength *)height
{
    if ([height isEqualTo:_height]) {
        return;
    }

    _height = height;
    [self invalidate];
}

- (void)setMaskUnits:(RNSVGUnits)maskUnits
{
    if (maskUnits == _maskUnits) {
        return;
    }

    _maskUnits = maskUnits;
    [self invalidate];
}

- (void)setMaskContentUnits:(RNSVGUnits)maskContentUnits
{
    if (maskContentUnits == _maskContentUnits) {
        return;
    }

    _maskContentUnits = maskContentUnits;
    [self invalidate];
}

- (void)setMaskTransform:(CGAffineTransform)maskTransform
{
    _maskTransform = maskTransform;
    [self invalidate];
}

@end


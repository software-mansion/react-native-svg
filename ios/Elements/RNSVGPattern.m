/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGPattern.h"
#import "RNSVGPainter.h"
#import "RNSVGBrushType.h"
#import "RNSVGNode.h"

@implementation RNSVGPattern

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (void)parseReference
{
    NSArray<RNSVGLength *> *points = @[self.x, self.y, self.width, self.height];
    RNSVGPainter *painter = [[RNSVGPainter alloc] initWithPointsArray:points];
    [painter setUnits:self.patternUnits];
    [painter setContentUnits:self.patternContentUnits];
    [painter setTransform:self.patternTransform];
    [painter setPattern:self];

    if (self.patternUnits == kRNSVGUnitsUserSpaceOnUse || self.patternContentUnits == kRNSVGUnitsUserSpaceOnUse) {
        [painter setUserSpaceBoundingBox:[self.svgView getContextBounds]];
    }

    [self.svgView definePainter:painter painterName:self.name];
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

- (void)setPatternUnits:(RNSVGUnits)patternUnits
{
    if (patternUnits == _patternUnits) {
        return;
    }

    _patternUnits = patternUnits;
    [self invalidate];
}

- (void)setPatternContentUnits:(RNSVGUnits)patternContentUnits
{
    if (patternContentUnits == _patternContentUnits) {
        return;
    }

    _patternContentUnits = patternContentUnits;
    [self invalidate];
}

- (void)setPatternTransform:(CGAffineTransform)patternTransform
{
    _patternTransform = patternTransform;
    [self invalidate];
}

- (void)setMinX:(CGFloat)minX
{
    if (minX == _minX) {
        return;
    }

    [self invalidate];
    _minX = minX;
}

- (void)setMinY:(CGFloat)minY
{
    if (minY == _minY) {
        return;
    }

    [self invalidate];
    _minY = minY;
}

- (void)setVbWidth:(CGFloat)vbWidth
{
    if (vbWidth == _vbWidth) {
        return;
    }

    [self invalidate];
    _vbWidth = vbWidth;
}

- (void)setVbHeight:(CGFloat)vbHeight
{
    if (_vbHeight == vbHeight) {
        return;
    }

    [self invalidate];
    _vbHeight = vbHeight;
}

- (void)setAlign:(NSString *)align
{
    if ([align isEqualToString:_align]) {
        return;
    }

    [self invalidate];
    _align = align;
}

- (void)setMeetOrSlice:(RNSVGVBMOS)meetOrSlice
{
    if (meetOrSlice == _meetOrSlice) {
        return;
    }

    [self invalidate];
    _meetOrSlice = meetOrSlice;
}

@end


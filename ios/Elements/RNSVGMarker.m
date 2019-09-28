/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGMarker.h"
#import "RNSVGPainter.h"
#import "RNSVGBrushType.h"
#import "RNSVGNode.h"

@implementation RNSVGMarker

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (void)parseReference
{
    self.dirty = false;
    [self.svgView defineMarker:self markerName:self.name];
}

- (void)setX:(RNSVGLength *)refX
{
    if ([refX isEqualTo:_refX]) {
        return;
    }
    
    _refX = refX;
    [self invalidate];
}

- (void)setY:(RNSVGLength *)refY
{
    if ([refY isEqualTo:_refY]) {
        return;
    }
    
    _refY = refY;
    [self invalidate];
}

- (void)setMarkerWidth:(RNSVGLength *)markerWidth
{
    if ([markerWidth isEqualTo:_markerWidth]) {
        return;
    }
    
    _markerWidth = markerWidth;
    [self invalidate];
}

- (void)setMarkerHeight:(RNSVGLength *)markerHeight
{
    if ([markerHeight isEqualTo:_markerHeight]) {
        return;
    }
    
    _markerHeight = markerHeight;
    [self invalidate];
}

- (void)setMarkerUnits:(NSString *)markerUnits
{
    if (markerUnits == _markerUnits) {
        return;
    }
    
    _markerUnits = markerUnits;
    [self invalidate];
}

- (void)setOrient:(NSString *)orient
{
    if ([orient isEqualToString:_orient]) {
        return;
    }
    
    [self invalidate];
    _orient = orient;
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


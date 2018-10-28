/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFilter.h"
#import "RNSVGNode.h"

@implementation RNSVGFilter

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (void)parseReference
{
    [self.svgView defineFilter:self filterName:self.name];
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

- (void)setFilterUnits:(RNSVGUnits)filterUnits
{
    if (filterUnits == _filterUnits) {
        return;
    }
    
    _filterUnits = filterUnits;
    [self invalidate];
}

- (void)setPrimitiveUnits:(RNSVGUnits)primitiveUnits
{
    if (primitiveUnits == _primitiveUnits) {
        return;
    }
    
    _primitiveUnits = primitiveUnits;
    [self invalidate];
}

@end


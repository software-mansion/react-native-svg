/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFilterPrimitive.h"
#import "RNSVGNode.h"

@implementation RNSVGFilterPrimitive

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (void)parseReference
{

}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
      previousFilterResult:(CIImage *)previous
{
    return previous;
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

- (void)setResult:(NSString *)result
{
    if ([result isEqualToString:_result]) {
        return;
    }

    [self invalidate];
    _result = result;
}

@end


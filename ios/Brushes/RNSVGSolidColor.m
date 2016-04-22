/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGSolidColor.h"

#import "RCTConvert+RNSVG.h"
#import "RCTLog.h"

@implementation RNSVGSolidColor
{
    CGColorRef _color;
}

- (instancetype)initWithArray:(NSArray<NSNumber *> *)array
{
    if ((self = [super initWithArray:array])) {
        _color = CGColorRetain([RCTConvert CGColor:array offset:1]);
    }
    return self;
}

- (void)dealloc
{
    CGColorRelease(_color);
}

- (BOOL)applyFillColor:(CGContextRef)context
{
    CGContextSetFillColorWithColor(context, _color);
    return YES;
}

- (BOOL)applyStrokeColor:(CGContextRef)context
{
    CGContextSetStrokeColorWithColor(context, _color);
    return YES;
}

@end

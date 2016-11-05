/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import "RNSVGTextPath.h"
#import "RNSVGBezierPath.h"

@class RNSVGText;
@implementation RNSVGTextPath

- (CGPathRef)getPath:(CGContextRef)context
{
    CGMutablePathRef path = CGPathCreateMutable();

    return (CGPathRef)CFAutorelease(path);
}

@end

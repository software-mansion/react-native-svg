/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGSpan.h"
#import "RNSVGBezierPath.h"
#import <CoreText/CoreText.h>

@implementation RNSVGSpan

- (CGPathRef)getPath:(CGContextRef)context
{
    CGMutablePathRef path = CGPathCreateMutable();
    
    return (CGPathRef)CFAutorelease(path);
}

@end

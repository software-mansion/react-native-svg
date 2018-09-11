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

@end


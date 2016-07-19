/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGDefination.h"

@class RNSVGNode;

@implementation RNSVGDefination

- (void)renderTo:(CGContextRef)context
{
    for (RNSVGNode *node in self.subviews) {
        [node saveDefination: context];
    }
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

@end


/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGLightSource.h"

@implementation RNSVGLightSource

- (void)renderTo:(CGContextRef)context
{
}

- (void)parseReference
{
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

- (SVGLightType)type
{
    return LS_UNKNOWN;
}

@end


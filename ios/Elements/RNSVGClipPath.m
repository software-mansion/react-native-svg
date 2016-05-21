/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGClipPath.h"

@implementation RNSVGClipPath

- (void)renderLayerTo:(CGContextRef)context
{
    [[self getSvgView] defineClipPath:[self getPath:context] clipPathId:self.name];
}

// hitTest delagate

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    return nil;
}

@end

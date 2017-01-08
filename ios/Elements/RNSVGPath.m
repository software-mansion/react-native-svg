/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGPath.h"

@implementation RNSVGPath

- (void)setD:(CGPathRef)d
{
    if (d == _d) {
        return;
    }
    
    [self invalidate];
    CGPathRelease(_d);
    _d = CGPathRetain(d);
}

- (CGPathRef)getPath:(CGContextRef)context
{
    return self.d;
}

- (void)dealloc
{
    CGPathRelease(_d);
}

@end

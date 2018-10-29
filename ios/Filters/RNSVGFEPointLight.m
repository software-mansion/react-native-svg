/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEPointLight.h"

@implementation RNSVGFEPointLight

- (void)setX:(NSNumber *)x
{
    if (x == _x) {
        return;
    }
    
    _x = x;
    [self invalidate];
}

- (void)setY:(NSNumber *)y
{
    if (y == _y) {
        return;
    }
    
    _y = y;
    [self invalidate];
}

- (void)setZ:(NSNumber *)z
{
    if (z == _z) {
        return;
    }
    
    _z = z;
    [self invalidate];
}

- (SVGLightType) type
{
    return LS_POINT;
}

@end

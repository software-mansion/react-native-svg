/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEOffset.h"
#import "RNSVGNode.h"

@implementation RNSVGFEOffset

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
{
    CIImage *inResult = self.in1 ? [results objectForKey:self.in1] : nil;
    CIImage *inputImage = inResult ? inResult : previous;
    
    CGFloat dx = (CGFloat)[self.dx doubleValue];
    CGFloat dy = (CGFloat)[self.dy doubleValue];
    CGAffineTransform offsetTransform = CGAffineTransformMakeTranslation(dx, dy);
    
    return [inputImage imageByApplyingTransform:offsetTransform];
}

- (void)setIn1:(NSString *)in1
{
    if ([in1 isEqualToString:_in1]) {
        return;
    }
    
    _in1 = in1;
    [self invalidate];
}

- (void)setDx:(NSNumber *)dx
{
    if (dx == _dx) {
        return;
    }
    
    _dx = dx;
    [self invalidate];
}

- (void)setDy:(NSNumber *)dy
{
    if (dy == _dy) {
        return;
    }
    
    _dy = dy;
    [self invalidate];
}

@end


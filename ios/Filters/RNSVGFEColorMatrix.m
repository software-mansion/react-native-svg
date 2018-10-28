/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEColorMatrix.h"
#import "RNSVGNode.h"

@implementation RNSVGFEColorMatrix

- (void)setIn1:(NSString *)in1
{
    if ([in1 isEqualToString:_in1]) {
        return;
    }

    _in1 = in1;
    [self invalidate];
}

- (void)setType:(RNSVGColorMatrixTypes *)type
{
    if (type == self.type) {
        return;
    }
    self.type = type;
    [self invalidate];
}

- (void)setValues:(NSArray<NSNumber *> *)values
{
    if (values == _values) {
        return;
    }

    _values = values;
    [self invalidate];
}

@end


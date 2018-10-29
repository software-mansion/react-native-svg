/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "RNSVGFEMergeNode.h"
#import "RNSVGNode.h"

@implementation RNSVGFEMergeNode

- (void)setIn1:(NSString *)in1
{
    if ([in1 isEqualToString:_in1]) {
        return;
    }
    
    _in1 = in1;
    [self invalidate];
}


@end


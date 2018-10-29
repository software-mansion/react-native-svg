/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFEMergeManager.h"
#import "RNSVGFEMerge.h"

@implementation RNSVGFEMergeManager

RCT_EXPORT_MODULE()

- (RNSVGFEMerge *)node
{
    return [RNSVGFEMerge new];
}

@end

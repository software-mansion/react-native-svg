/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFEMergeNodeManager.h"
#import "RNSVGFEMergeNode.h"

@implementation RNSVGFEMergeNodeManager

RCT_EXPORT_MODULE()

- (RNSVGFEMergeNode *)node
{
    return [RNSVGFEMergeNode new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)

@end

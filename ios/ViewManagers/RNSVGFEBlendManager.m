/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFEBlendManager.h"
#import "RNSVGFEBlend.h"

@implementation RNSVGFEBlendManager

RCT_EXPORT_MODULE()

- (RNSVGFEBlend *)node
{
    return [RNSVGFEBlend new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(in2, NSString)
RCT_EXPORT_VIEW_PROPERTY(mode, RNSVGBlendModeTypes)

@end

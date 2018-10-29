/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFEOffsetManager.h"
#import "RNSVGFEOffset.h"

@implementation RNSVGFEOffsetManager

RCT_EXPORT_MODULE()

- (RNSVGFEOffset *)node
{
    return [RNSVGFEOffset new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(dx, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(dy, NSNumber)

@end

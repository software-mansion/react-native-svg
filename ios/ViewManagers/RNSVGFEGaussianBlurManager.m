/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFEGaussianBlurManager.h"
#import "RNSVGFEGaussianBlur.h"

@implementation RNSVGFEGaussianBlurManager

RCT_EXPORT_MODULE()

- (RNSVGFEGaussianBlur *)node
{
    return [RNSVGFEGaussianBlur new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(edgeMode, RNSVGEdgeModeValues)
RCT_EXPORT_VIEW_PROPERTY(stdDeviationX, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(stdDeviationY, NSNumber)

@end

/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFEColorMatrixManager.h"
#import "RNSVGFEColorMatrix.h"

@implementation RNSVGFEColorMatrixManager

RCT_EXPORT_MODULE()

- (RNSVGFEColorMatrix *)node
{
    return [RNSVGFEColorMatrix new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(type, RNSVGColorMatrixTypes)
RCT_EXPORT_VIEW_PROPERTY(values, NSArray<NSNumber *>)

@end

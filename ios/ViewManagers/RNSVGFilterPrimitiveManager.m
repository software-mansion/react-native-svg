/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFilterPrimitiveManager.h"
#import "RNSVGFilterPrimitive.h"

@implementation RNSVGFilterPrimitiveManager

RCT_EXPORT_MODULE()

- (RNSVGFilterPrimitive *)node
{
    return [RNSVGFilterPrimitive new];
}

RCT_EXPORT_VIEW_PROPERTY(x, RNSVGLength*)
RCT_EXPORT_VIEW_PROPERTY(y, RNSVGLength*)
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGFilterPrimitive)
{
    view.height = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGFilterPrimitive)
{
    view.width = [RCTConvert RNSVGLength:json];
}
RCT_EXPORT_VIEW_PROPERTY(result, NSString)

@end

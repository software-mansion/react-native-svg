/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFECompositeManager.h"
#import "RNSVGFEComposite.h"

@implementation RNSVGFECompositeManager

RCT_EXPORT_MODULE()

- (RNSVGFEComposite *)node
{
    return [RNSVGFEComposite new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(in2, NSString)
RCT_CUSTOM_VIEW_PROPERTY(operator, id, RNSVGFEComposite)
{
    view.Operator = [RCTConvert RNSVGCompositeOperators:json];
}
RCT_EXPORT_VIEW_PROPERTY(k1, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(k2, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(k3, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(k4, NSNumber)

@end

/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFEPointLightManager.h"
#import "RNSVGFEPointLight.h"

@implementation RNSVGFEPointLightManager

RCT_EXPORT_MODULE()

- (RNSVGFEPointLight *)node
{
    return [RNSVGFEPointLight new];
}

RCT_EXPORT_VIEW_PROPERTY(x, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(y, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(z, NSNumber)

@end

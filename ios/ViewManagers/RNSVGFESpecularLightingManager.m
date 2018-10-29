/**
 * Copyright (c) 2015-present, react-native-community.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGFESpecularLightingManager.h"
#import "RNSVGFESpecularLighting.h"

@implementation RNSVGFESpecularLightingManager

RCT_EXPORT_MODULE()

- (RNSVGFESpecularLighting *)node
{
    return [RNSVGFESpecularLighting new];
}

RCT_EXPORT_VIEW_PROPERTY(in1, NSString)
RCT_EXPORT_VIEW_PROPERTY(surfaceScale, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(specularConstant, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(specularExponent, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(kernelUnitLengthX, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(kernelUnitLengthY, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(lightingColor, UIColor)

@end

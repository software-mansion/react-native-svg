/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGMaskManager.h"
#import "RNSVGMask.h"

@implementation RNSVGMaskManager

RCT_EXPORT_MODULE()

- (RNSVGMask *)node
{
    return [RNSVGMask new];
}

RCT_EXPORT_VIEW_PROPERTY(x, NSString)
RCT_EXPORT_VIEW_PROPERTY(y, NSString)
RCT_EXPORT_VIEW_PROPERTY(maskwidth, NSString)
RCT_EXPORT_VIEW_PROPERTY(maskheight, NSString)
RCT_EXPORT_VIEW_PROPERTY(maskUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(maskContentUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(maskTransform, CGAffineTransform)

@end

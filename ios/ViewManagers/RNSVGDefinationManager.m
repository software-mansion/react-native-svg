/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGDefination.h"
#import "RNSVGDefinationManager.h"

@implementation RNSVGDefinationManager

RCT_EXPORT_MODULE()

- (RNSVGDefination *)node
{
  return [RNSVGDefination new];
}

- (UIView *)view
{
    return [self node];
}

- (RCTShadowView *)shadowView
{
    return nil;
}

@end

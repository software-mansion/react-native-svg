/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RNSVGNodeManager.h"

#import "RNSVGNode.h"

@implementation RNSVGNodeManager

RCT_EXPORT_MODULE()

- (RNSVGNode *)node
{
  return [RNSVGNode new];
}

- (UIView *)view
{
  return [self node];
}

- (RCTShadowView *)shadowView
{
  return nil;
}

RCT_EXPORT_VIEW_PROPERTY(opacity, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(transform, CGAffineTransform)

@end

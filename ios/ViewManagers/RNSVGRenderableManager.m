/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RNSVGRenderableManager.h"

#import "RCTConvert+RNSVG.h"

@implementation RNSVGRenderableManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
  return [RNSVGRenderable new];
}

RCT_EXPORT_VIEW_PROPERTY(strokeWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(strokeLinecap, CGLineCap)
RCT_EXPORT_VIEW_PROPERTY(strokeLinejoin, CGLineJoin)
RCT_EXPORT_VIEW_PROPERTY(fill, RNSVGBrush)
RCT_EXPORT_VIEW_PROPERTY(stroke, CGColor)
RCT_EXPORT_VIEW_PROPERTY(strokeDash, RNSVGCGFloatArray)

@end

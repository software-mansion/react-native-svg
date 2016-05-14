/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGLineManager.h"

#import "RNSVGLine.h"
#import "RCTConvert+RNSVG.h"

@implementation RNSVGLineManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
  return [RNSVGLine new];
}

RCT_EXPORT_VIEW_PROPERTY(x1, NSString)
RCT_EXPORT_VIEW_PROPERTY(y1, NSString)
RCT_EXPORT_VIEW_PROPERTY(x2, NSString)
RCT_EXPORT_VIEW_PROPERTY(y2, NSString)

// fix me: these should inherited from renderable
RCT_EXPORT_VIEW_PROPERTY(fill, RNSVGBrush)
RCT_EXPORT_VIEW_PROPERTY(fillRule, RNSVGCGFCRule)
RCT_EXPORT_VIEW_PROPERTY(stroke, RNSVGBrush)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(strokeLinecap, CGLineCap)
RCT_EXPORT_VIEW_PROPERTY(strokeLinejoin, CGLineJoin)
RCT_EXPORT_VIEW_PROPERTY(clipPath, CGPath)
RCT_EXPORT_VIEW_PROPERTY(clipRule, RNSVGCGFCRule)
RCT_EXPORT_VIEW_PROPERTY(strokeDasharray, RNSVGCGFloatArray)
RCT_EXPORT_VIEW_PROPERTY(strokeDashoffset, CGFloat)

@end

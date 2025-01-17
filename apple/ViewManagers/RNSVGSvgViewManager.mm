/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGSvgViewManager.h"
#import "RNSVGSvgView.h"

@implementation RNSVGSvgViewManager

RCT_EXPORT_MODULE()

- (RNSVGPlatformView *)view
{
  return [RNSVGSvgView new];
}

RCT_EXPORT_VIEW_PROPERTY(bbWidth, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(bbHeight, RNSVGLength *)
RCT_EXPORT_VIEW_PROPERTY(minX, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(minY, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(vbWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(vbHeight, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(align, NSString)
RCT_EXPORT_VIEW_PROPERTY(meetOrSlice, RNSVGVBMOS)
RCT_EXPORT_VIEW_PROPERTY(color, UIColor)
RCT_CUSTOM_VIEW_PROPERTY(hitSlop, UIEdgeInsets, RNSVGSvgView)
{
  if ([view respondsToSelector:@selector(setHitTestEdgeInsets:)]) {
    if (json) {
      UIEdgeInsets hitSlopInsets = [RCTConvert UIEdgeInsets:json];
      [view setHitTestEdgeInsets:UIEdgeInsetsMake(
                                     -hitSlopInsets.top,
                                     -hitSlopInsets.left,
                                     -hitSlopInsets.bottom,
                                     -hitSlopInsets.right)];
    } else {
      view.hitTestEdgeInsets = defaultView.hitTestEdgeInsets;
    }
  }
}

@end

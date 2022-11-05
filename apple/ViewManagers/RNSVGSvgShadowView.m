/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGSvgShadowView.h"

@implementation RNSVGSvgShadowView

- (instancetype)init
{
  if (self = [super init]) {
    YGNodeSetMeasureFunc(self.yogaNode, RNSVGSvgShadowViewMeasure);
  }

  return self;
}

static YGSize
RNSVGSvgShadowViewMeasure(YGNodeRef node, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)
{
  RNSVGSvgShadowView *shadowView = (__bridge RNSVGSvgShadowView *)YGNodeGetContext(node);

  CGSize size = {width, height};
  CGSize maximumSize = {
      widthMode == YGMeasureModeAtMost ? size.width : CGFLOAT_MAX,
      heightMode == YGMeasureModeAtMost ? size.height : CGFLOAT_MAX,
  };
  if (shadowView.vbWidth != 0 && shadowView.vbHeight != 0) {
    if (widthMode != YGMeasureModeExactly) {
      size.width = MIN(shadowView.vbWidth / shadowView.vbHeight * size.height, maximumSize.width);
    }
    if (heightMode != YGMeasureModeExactly) {
      size.height = MIN(shadowView.vbHeight / shadowView.vbWidth * size.width, maximumSize.height);
    }
  }

  return (YGSize){
      RCTYogaFloatFromCoreGraphicsFloat(size.width),
      RCTYogaFloatFromCoreGraphicsFloat(size.height),
  };
}

- (BOOL)isYogaLeafNode
{
  return YES;
}

- (void)layoutSubviewsWithContext:(RCTLayoutContext)layoutContext
{
  // Do nothing.
}

@end

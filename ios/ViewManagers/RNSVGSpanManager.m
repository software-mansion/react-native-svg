/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGSpanManager.h"

#import "RNSVGSpan.h"
#import "RCTConvert+RNSVG.h"

@implementation RNSVGSpanManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
  return [RNSVGSpan new];
}

RCT_EXPORT_VIEW_PROPERTY(dx, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(dy, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(px, NSString)
RCT_EXPORT_VIEW_PROPERTY(py, NSString)
RCT_REMAP_VIEW_PROPERTY(font, font, RNSVGFont)
RCT_EXPORT_VIEW_PROPERTY(content, NSString)

@end

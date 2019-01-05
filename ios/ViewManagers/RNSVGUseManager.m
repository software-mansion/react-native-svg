/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGUseManager.h"
#import "RNSVGUse.h"

@implementation RNSVGUseManager

RCT_EXPORT_MODULE()

- (RNSVGNode *)node
{
  return [RNSVGUse new];
}

RCT_EXPORT_VIEW_PROPERTY(href, NSString)
RCT_CUSTOM_VIEW_PROPERTY(useheight, id, RNSVGUse)
{
    view.height = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(usewidth, id, RNSVGUse)
{
    view.width = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGUse)
{
    view.height = [RCTConvert RNSVGLength:json];
}
RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGUse)
{
    view.width = [RCTConvert RNSVGLength:json];
}

@end

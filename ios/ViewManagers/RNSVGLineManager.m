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

RCT_CUSTOM_VIEW_PROPERTY(x1, id, RNSVGLine)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.x1 = stringValue;
    } else {
        view.x1 = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(y1, id, RNSVGLine)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.y1 = stringValue;
    } else {
        view.y1 = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(x2, id, RNSVGLine)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.x2 = stringValue;
    } else {
        view.x2 = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(y2, id, RNSVGLine)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.y2 = stringValue;
    } else {
        view.y2 = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

@end

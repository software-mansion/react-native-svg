/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGCircleManager.h"

#import "RNSVGCircle.h"
#import "RCTConvert+RNSVG.h"

@implementation RNSVGCircleManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
    return [RNSVGCircle new];
}

RCT_CUSTOM_VIEW_PROPERTY(cx, id, RNSVGCircle)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.cx = stringValue;
    } else {
        view.cx = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(cy, id, RNSVGCircle)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.cy = stringValue;
    } else {
        view.cy = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(r, id, RNSVGCircle)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.r = stringValue;
    } else {
        view.r = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

@end

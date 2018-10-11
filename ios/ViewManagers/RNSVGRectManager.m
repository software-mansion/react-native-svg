/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRectManager.h"

#import "RNSVGRect.h"
#import "RCTConvert+RNSVG.h"

@implementation RNSVGRectManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
  return [RNSVGRect new];
}

RCT_CUSTOM_VIEW_PROPERTY(x, id, RNSVGRect)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.x = stringValue;
    } else {
        view.x = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(y, id, RNSVGRect)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.y = stringValue;
    } else {
        view.y = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(rectheight, id, RNSVGRect)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.rectheight = stringValue;
    } else {
        view.rectheight = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(rectwidth, id, RNSVGRect)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.rectwidth = stringValue;
    } else {
        view.rectwidth = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGRect)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.rectheight = stringValue;
    } else {
        view.rectheight = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGRect)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.rectwidth = stringValue;
    } else {
        view.rectwidth = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(rx, id, RNSVGRect)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.rx = stringValue;
    } else {
        view.rx = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(ry, id, RNSVGRect)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.ry = stringValue;
    } else {
        view.ry = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

@end

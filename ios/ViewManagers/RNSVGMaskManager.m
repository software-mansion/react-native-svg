/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGMaskManager.h"
#import "RNSVGMask.h"

@implementation RNSVGMaskManager

RCT_EXPORT_MODULE()

- (RNSVGMask *)node
{
    return [RNSVGMask new];
}

RCT_CUSTOM_VIEW_PROPERTY(x, id, RNSVGMask)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.x = stringValue;
    } else {
        view.x = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(y, id, RNSVGMask)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.y = stringValue;
    } else {
        view.y = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(maskheight, id, RNSVGMask)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.maskheight = stringValue;
    } else {
        view.maskheight = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(maskwidth, id, RNSVGMask)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.maskwidth = stringValue;
    } else {
        view.maskwidth = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGMask)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.maskheight = stringValue;
    } else {
        view.maskheight = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGMask)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.maskwidth = stringValue;
    } else {
        view.maskwidth = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_EXPORT_VIEW_PROPERTY(maskUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(maskContentUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(maskTransform, CGAffineTransform)

@end

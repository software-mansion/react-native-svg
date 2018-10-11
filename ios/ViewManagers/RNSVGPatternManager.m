/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGPatternManager.h"
#import "RNSVGPattern.h"

@implementation RNSVGPatternManager

RCT_EXPORT_MODULE()

- (RNSVGPattern *)node
{
    return [RNSVGPattern new];
}

RCT_CUSTOM_VIEW_PROPERTY(x, id, RNSVGPattern)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.x = stringValue;
    } else {
        view.x = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(y, id, RNSVGPattern)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.y = stringValue;
    } else {
        view.y = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(patternheight, id, RNSVGPattern)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.patternheight = stringValue;
    } else {
        view.patternheight = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(patternwidth, id, RNSVGPattern)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.patternwidth = stringValue;
    } else {
        view.patternwidth = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGPattern)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.patternheight = stringValue;
    } else {
        view.patternheight = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGPattern)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.patternwidth = stringValue;
    } else {
        view.patternwidth = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_EXPORT_VIEW_PROPERTY(patternUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(patternContentUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(patternTransform, CGAffineTransform)

RCT_EXPORT_VIEW_PROPERTY(minX, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(minY, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(vbWidth, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(vbHeight, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(align, NSString)
RCT_EXPORT_VIEW_PROPERTY(meetOrSlice, RNSVGVBMOS)

@end

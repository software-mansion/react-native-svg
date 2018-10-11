/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRadialGradientManager.h"
#import "RNSVGRadialGradient.h"

@implementation RNSVGRadialGradientManager

RCT_EXPORT_MODULE()

- (RNSVGNode *)node
{
  return [RNSVGRadialGradient new];
}

RCT_CUSTOM_VIEW_PROPERTY(fx, id, RNSVGRadialGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.fx = stringValue;
    } else {
        view.fx = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(fy, id, RNSVGRadialGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.fy = stringValue;
    } else {
        view.fy = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(cx, id, RNSVGRadialGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.cx = stringValue;
    } else {
        view.cx = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(cy, id, RNSVGRadialGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.cy = stringValue;
    } else {
        view.cy = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(rx, id, RNSVGRadialGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.rx = stringValue;
    } else {
        view.rx = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(ry, id, RNSVGRadialGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.ry = stringValue;
    } else {
        view.ry = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

RCT_EXPORT_VIEW_PROPERTY(gradient, NSArray<NSNumber *>)
RCT_EXPORT_VIEW_PROPERTY(gradientUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(gradientTransform, CGAffineTransform)

@end

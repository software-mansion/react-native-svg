/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGLinearGradientManager.h"
#import "RNSVGLinearGradient.h"

@implementation RNSVGLinearGradientManager

RCT_EXPORT_MODULE()

- (RNSVGNode *)node
{
  return [RNSVGLinearGradient new];
}

RCT_CUSTOM_VIEW_PROPERTY(x1, id, RNSVGLinearGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.x1 = stringValue;
    } else {
        view.x1 = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(y1, id, RNSVGLinearGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.y1 = stringValue;
    } else {
        view.y1 = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(x2, id, RNSVGLinearGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.x2 = stringValue;
    } else {
        view.x2 = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(y2, id, RNSVGLinearGradient)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.y2 = stringValue;
    } else {
        view.y2 = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_EXPORT_VIEW_PROPERTY(gradient, NSArray<NSNumber *>)
RCT_EXPORT_VIEW_PROPERTY(gradientUnits, RNSVGUnits)
RCT_EXPORT_VIEW_PROPERTY(gradientTransform, CGAffineTransform)

@end

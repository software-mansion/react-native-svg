/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGEllipseManager.h"

#import "RNSVGEllipse.h"
#import "RCTConvert+RNSVG.h"

@implementation RNSVGEllipseManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
  return [RNSVGEllipse new];
}

RCT_CUSTOM_VIEW_PROPERTY(cx, id, RNSVGEllipse)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.cx = stringValue;
    } else {
        view.cx = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(cy, id, RNSVGEllipse)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.cy = stringValue;
    } else {
        view.cy = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(rx, id, RNSVGEllipse)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.rx = stringValue;
    } else {
        view.rx = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(ry, id, RNSVGEllipse)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.ry = stringValue;
    } else {
        view.ry = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGImageManager.h"
#import "RNSVGVBMOS.h"
#import "RNSVGImage.h"
#import "RCTConvert+RNSVG.h"

@implementation RNSVGImageManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
    RNSVGImage *svgImage = [RNSVGImage new];
    svgImage.bridge = self.bridge;

    return svgImage;
}

RCT_CUSTOM_VIEW_PROPERTY(x, id, RNSVGImage)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.x = stringValue;
    } else {
        view.x = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(y, id, RNSVGImage)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.y = stringValue;
    } else {
        view.y = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(imagewidth, id, RNSVGImage)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.imagewidth = stringValue;
    } else {
        view.imagewidth = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(width, id, RNSVGImage)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.imagewidth = stringValue;
    } else {
        view.imagewidth = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(imageheight, id, RNSVGImage)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.imageheight = stringValue;
    } else {
        view.imageheight = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(height, id, RNSVGImage)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.imageheight = stringValue;
    } else {
        view.imageheight = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_EXPORT_VIEW_PROPERTY(src, id)
RCT_EXPORT_VIEW_PROPERTY(align, NSString)
RCT_EXPORT_VIEW_PROPERTY(meetOrSlice, RNSVGVBMOS)

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGTextManager.h"

#import "RNSVGText.h"
#import "RCTConvert+RNSVG.h"

@implementation RNSVGTextManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
  return [RNSVGText new];
}

RCT_EXPORT_VIEW_PROPERTY(textAnchor, RNSVGTextAnchor)
RCT_CUSTOM_VIEW_PROPERTY(dx, id, RNSVGText)
{
    if ([json isKindOfClass:[NSArray class]]) {
        NSArray<NSString *> *arrayValue = (NSArray<NSString *> *)json;
        view.deltaX = arrayValue;
    } else if ([json isKindOfClass:[NSString class]]) {
        view.deltaX = [NSArray arrayWithObject:json];
    } else if ([json isKindOfClass:[NSNumber class]]) {
        view.deltaX = [NSArray arrayWithObject:[NSString stringWithFormat:@"%f", [json floatValue]]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(dy, id, RNSVGText)
{
    if ([json isKindOfClass:[NSArray class]]) {
        NSArray<NSString *> *arrayValue = (NSArray<NSString *> *)json;
        view.deltaY = arrayValue;
    } else if ([json isKindOfClass:[NSString class]]) {
        view.deltaY = [NSArray arrayWithObject:json];
    } else if ([json isKindOfClass:[NSNumber class]]) {
        view.deltaY = [NSArray arrayWithObject:[NSString stringWithFormat:@"%f", [json floatValue]]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(positionX, id, RNSVGText)
{
    if ([json isKindOfClass:[NSArray class]]) {
        NSArray<NSString *> *arrayValue = (NSArray<NSString *> *)json;
        view.positionX = arrayValue;
    } else if ([json isKindOfClass:[NSString class]]) {
        view.positionX = [NSArray arrayWithObject:json];
    } else if ([json isKindOfClass:[NSNumber class]]) {
        view.positionX = [NSArray arrayWithObject:[NSString stringWithFormat:@"%f", [json floatValue]]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(positionY, id, RNSVGText)
{
    if ([json isKindOfClass:[NSArray class]]) {
        NSArray<NSString *> *arrayValue = (NSArray<NSString *> *)json;
        view.positionY = arrayValue;
    } else if ([json isKindOfClass:[NSString class]]) {
        view.positionY = [NSArray arrayWithObject:json];
    } else if ([json isKindOfClass:[NSNumber class]]) {
        view.positionY = [NSArray arrayWithObject:[NSString stringWithFormat:@"%f", [json floatValue]]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(x, id, RNSVGText)
{
    if ([json isKindOfClass:[NSArray class]]) {
        NSArray<NSString *> *arrayValue = (NSArray<NSString *> *)json;
        view.positionX = arrayValue;
    } else if ([json isKindOfClass:[NSString class]]) {
        view.positionX = [NSArray arrayWithObject:json];
    } else if ([json isKindOfClass:[NSNumber class]]) {
        view.positionX = [NSArray arrayWithObject:[NSString stringWithFormat:@"%f", [json floatValue]]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(y, id, RNSVGText)
{
    if ([json isKindOfClass:[NSArray class]]) {
        NSArray<NSString *> *arrayValue = (NSArray<NSString *> *)json;
        view.positionY = arrayValue;
    } else if ([json isKindOfClass:[NSString class]]) {
        view.positionY = [NSArray arrayWithObject:json];
    } else if ([json isKindOfClass:[NSNumber class]]) {
        view.positionY = [NSArray arrayWithObject:[NSString stringWithFormat:@"%f", [json floatValue]]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(rotate, id, RNSVGText)
{
    if ([json isKindOfClass:[NSArray class]]) {
        NSArray<NSString *> *arrayValue = (NSArray<NSString *> *)json;
        view.rotate = arrayValue;
    } else if ([json isKindOfClass:[NSString class]]) {
        view.rotate = [NSArray arrayWithObject:json];
    } else if ([json isKindOfClass:[NSNumber class]]) {
        view.rotate = [NSArray arrayWithObject:[NSString stringWithFormat:@"%f", [json floatValue]]];
    }
}
RCT_EXPORT_VIEW_PROPERTY(font, NSDictionary)
RCT_CUSTOM_VIEW_PROPERTY(textLength, id, RNSVGText)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.textLength = stringValue;
    } else {
        view.textLength = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_CUSTOM_VIEW_PROPERTY(baselineShift, id, RNSVGText)
{
    if ([json isKindOfClass:[NSString class]]) {
        NSString *stringValue = (NSString *)json;
        view.baselineShift = stringValue;
    } else {
        view.baselineShift = [NSString stringWithFormat:@"%f", [json floatValue]];
    }
}
RCT_EXPORT_VIEW_PROPERTY(lengthAdjust, NSString)
RCT_EXPORT_VIEW_PROPERTY(alignmentBaseline, NSString)

@end

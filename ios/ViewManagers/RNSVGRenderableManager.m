/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import "RNSVGRenderableManager.h"

#import "RCTConvert+RNSVG.h"
#import "RNSVGCGFCRule.h"

@implementation RNSVGRenderableManager

RCT_EXPORT_MODULE()

- (RNSVGRenderable *)node
{
    return [RNSVGRenderable new];
}

RCT_EXPORT_VIEW_PROPERTY(fill, RNSVGBrush)
RCT_EXPORT_VIEW_PROPERTY(fillOpacity, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(fillRule, RNSVGCGFCRule)
RCT_EXPORT_VIEW_PROPERTY(stroke, RNSVGBrush)
RCT_EXPORT_VIEW_PROPERTY(strokeOpacity, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, RNSVGLength*)
RCT_EXPORT_VIEW_PROPERTY(strokeLinecap, CGLineCap)
RCT_EXPORT_VIEW_PROPERTY(strokeLinejoin, CGLineJoin)
RCT_EXPORT_VIEW_PROPERTY(strokeDasharray, NSArray<RNSVGLength *>)
RCT_EXPORT_VIEW_PROPERTY(strokeDashoffset, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(strokeMiterlimit, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(vectorEffect, int)
RCT_EXPORT_VIEW_PROPERTY(propList, NSArray<NSString *>)

- (void)isPointInFill:(nonnull NSNumber *)reactTag point:(CGPoint)point callback:(RCTResponseSenderBlock)callback attempt:(int)attempt {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        __kindof UIView *view = viewRegistry[reactTag];
        UIView *target;
        if (!view) {
            if (attempt < 1) {
                void (^retryBlock)(void) = ^{
                    [self isPointInFill:reactTag point:point callback:callback attempt:(attempt + 1)];
                };
                RCTExecuteOnUIManagerQueue(retryBlock);
            } else {
                callback(@[[NSNumber numberWithBool:false]]);
            }
            return;
        }
        if ([view isKindOfClass:[RNSVGRenderable class]]) {
            RNSVGRenderable *svg = view;
            target = [svg hitTest:point withEvent:nil];
            BOOL hit = target != nil;
            callback(@[[NSNumber numberWithBool:hit]]);
        } else {
            RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
            callback(@[[NSNumber numberWithBool:false]]);
        }
    }];
}

RCT_EXPORT_METHOD(isPointInFill:(nonnull NSNumber *)reactTag options:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback)
{
    if (options == nil) {
        RCTLogError(@"Invalid options given to isPointInFill, got: %@", options);
        callback(@[[NSNumber numberWithBool:false]]);
        return;
    }
    id xo = [options objectForKey:@"x"];
    id yo = [options objectForKey:@"y"];
    if (![xo isKindOfClass:NSNumber.class] ||
        ![yo isKindOfClass:NSNumber.class]) {
        RCTLogError(@"Invalid x or y given to isPointInFill");
        callback(@[[NSNumber numberWithBool:false]]);
        return;
    }
    CGFloat x = (CGFloat)[xo floatValue];
    CGFloat y = (CGFloat)[yo floatValue];
    CGPoint point = CGPointMake(x, y);
    [self isPointInFill:reactTag point:point callback:callback attempt:0];
}


@end

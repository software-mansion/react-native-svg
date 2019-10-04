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
#import "RNSVGPathMeasure.h"

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

typedef void (^RNSVGSuccessBlock)(RNSVGRenderable *view);
typedef void (^RNSVGFailBlock)(void);

- (void)withTag:(nonnull NSNumber *)reactTag success:(RNSVGSuccessBlock)successBlock fail:(RNSVGFailBlock)failBlock attempt:(int)attempt {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        __kindof UIView *view = viewRegistry[reactTag];
        if (!view) {
            if (attempt < 1) {
                void (^retryBlock)(void) = ^{
                    [self withTag:reactTag success:successBlock fail:failBlock attempt:(attempt + 1)];
                };
                RCTExecuteOnUIManagerQueue(retryBlock);
            } else {
                failBlock();
            }
        } else if ([view isKindOfClass:[RNSVGRenderable class]]) {
            RNSVGRenderable *svg = view;
            successBlock(svg);
        } else {
            RCTLogError(@"Invalid svg returned from registry, expecting RNSVGRenderable, got: %@", view);
            failBlock();
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
    [self
     withTag:reactTag
     success:^(RNSVGRenderable *svg){
         UIView *target = [svg hitTest:point withEvent:nil];
         BOOL hit = target != nil;
         callback(@[[NSNumber numberWithBool:hit]]);
     }
     fail:^{
         callback(@[[NSNumber numberWithBool:false]]);
     }
     attempt:0];
}

RCT_EXPORT_METHOD(getTotalLength:(nonnull NSNumber *)reactTag callback:(RCTResponseSenderBlock)callback)
{
    [self
     withTag:reactTag
     success:^(RNSVGRenderable *svg){
         CGPathRef target = [svg getPath:nil];
         RNSVGPathMeasure *measure = [[RNSVGPathMeasure alloc]init];
         [measure extractPathData:target];

         CGFloat pathLegth = measure.pathLength;
         callback(@[[NSNumber numberWithDouble:pathLegth]]);
     }
     fail:^{
         callback(@[[NSNumber numberWithBool:false]]);
     }
     attempt:0];
}

RCT_EXPORT_METHOD(getPointAtLength:(nonnull NSNumber *)reactTag options:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback)
{
    id length = [options objectForKey:@"length"];
    CGFloat x = (CGFloat)[length floatValue];
    [self
     withTag:reactTag
     success:^(RNSVGRenderable *svg){
         CGPathRef target = [svg getPath:nil];
         RNSVGPathMeasure *measure = [[RNSVGPathMeasure alloc]init];
         [measure extractPathData:target];
         CGFloat angle;
         CGFloat px;
         CGFloat py;
         [measure getPosAndTan:&angle midPoint:fmax(0, fmin(measure.pathLength, x)) px:&px py:&py];
         callback(@[[NSNumber numberWithDouble:px], [NSNumber numberWithDouble:py]]);
     }
     fail:^{
         callback(@[[NSNumber numberWithBool:false]]);
     }
     attempt:0];
}

RCT_EXPORT_METHOD(getBBox:(nonnull NSNumber *)reactTag options:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback)
{
    [self
     withTag:reactTag
     success:^(RNSVGRenderable *svg){
         BOOL fill = [[options objectForKey:@"fill"] boolValue];
         BOOL stroke = [[options objectForKey:@"stroke"] boolValue];
         BOOL markers = [[options objectForKey:@"markers"] boolValue];
         BOOL clipped = [[options objectForKey:@"clipped"] boolValue];
         [svg getPath:nil];
         CGRect bounds = CGRectZero;
         if (fill) {
             bounds = CGRectUnion(bounds, svg.fillBounds);
         }
         if (stroke) {
             bounds = CGRectUnion(bounds, svg.strokeBounds);
         }
         if (markers) {
             bounds = CGRectUnion(bounds, svg.markerBounds);
         }
         if (clipped) {
             CGPathRef clipPath = [svg getClipPath];
             CGRect clipBounds = CGPathGetBoundingBox(clipPath);
             bounds = CGRectIntersection(bounds, clipBounds);
         }
         CGPoint origin = bounds.origin;
         CGSize size = bounds.size;
         callback(@[
                    [NSNumber numberWithDouble:origin.x],
                    [NSNumber numberWithDouble:origin.y],
                    [NSNumber numberWithDouble:size.width],
                    [NSNumber numberWithDouble:size.height]
                    ]);
     }
     fail:^{
         callback(@[[NSNumber numberWithBool:false]]);
     }
     attempt:0];
}

RCT_EXPORT_METHOD(getCTM:(nonnull NSNumber *)reactTag callback:(RCTResponseSenderBlock)callback)
{
    [self
     withTag:reactTag
     success:^(RNSVGRenderable *svg){
         CGAffineTransform ctm = svg.ctm;
         callback(@[
                    n(ctm.a), n(ctm.c), n(ctm.tx),
                    n(ctm.b), n(ctm.d), n(ctm.ty)
                    ]);
     }
     fail:^{
         callback(@[[NSNumber numberWithBool:false]]);
     }
     attempt:0];
}

static NSNumber *n(CGFloat af) {
    return [NSNumber numberWithDouble:af];
}

RCT_EXPORT_METHOD(getScreenCTM:(nonnull NSNumber *)reactTag callback:(RCTResponseSenderBlock)callback)
{
    [self
     withTag:reactTag
     success:^(RNSVGRenderable *svg){
         CGAffineTransform screenCTM = svg.screenCTM;
         callback(@[
                    n(screenCTM.a), n(screenCTM.c), n(screenCTM.tx),
                    n(screenCTM.b), n(screenCTM.d), n(screenCTM.ty)
                    ]);
     }
     fail:^{
         callback(@[[NSNumber numberWithBool:false]]);
     }
     attempt:0];
}

@end

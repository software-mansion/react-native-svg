/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGRadialGradient.h"

#import "RCTConvert+RNSVG.h"
#import "RCTLog.h"

@implementation RNSVGRadialGradient
{
    CGGradientRef _gradient;
}

- (instancetype)initWithArray:(NSArray *)array
{
    if ((self = [super initWithArray:array])) {
        if (array.count < 7) {
            RCTLogError(@"-[%@ %@] expects 7 elements, received %@",
                        self.class, NSStringFromSelector(_cmd), array);
            return nil;
        }
        _points = [array subarrayWithRange:NSMakeRange(1, 6)];
        
        NSMutableArray *gradient = [[NSMutableArray alloc] init];
        int count = ([array count] - 7) / 5;
        int startStops = [array count] - count;
        for (int i = 0; i < count; i++) {
            [gradient insertObject:[array objectAtIndex:(i * 4 + 7)] atIndex:(i * 4)];
            [gradient insertObject:[array objectAtIndex:(i * 4 + 8)] atIndex:(i * 4 + 1)];
            [gradient insertObject:[array objectAtIndex:(i * 4 + 9)] atIndex:(i * 4 + 2)];
            [gradient insertObject:[array objectAtIndex:(i * 4 + 10)] atIndex:(i * 4 + 3)];
            NSNumber *stop = [NSNumber numberWithFloat:[[array objectAtIndex:(startStops + (count - i - 1))] floatValue]];

            [gradient insertObject:stop atIndex:i * 4 + 4];

        }
        
        _gradient = CGGradientRetain([RCTConvert CGGradient:gradient offset:0]);
    }
    return self;
}

- (void)dealloc
{
    CGGradientRelease(_gradient);
}

- (void)paint:(CGContextRef)context
{
    
    CGRect box = CGContextGetClipBoundingBox(context);
    float height = CGRectGetHeight(box);
    float width = CGRectGetWidth(box);
    float midX = CGRectGetMidX(box);
    float midY = CGRectGetMidY(box);
    float offsetX = (midX - width / 2);
    float offsetY = (midY - height / 2);
    CGFloat rx = [self getActualProp:2 relative:width offset:0];
    CGFloat ry = [self getActualProp:3 relative:height offset:0];
    CGFloat fx = [self getActualProp:0 relative:width offset:offsetX];
    CGFloat fy = [self getActualProp:1 relative:height offset:offsetY] / (ry / rx);
    CGFloat cx = [self getActualProp:4 relative:width offset:offsetX];
    CGFloat cy = [self getActualProp:5 relative:height offset:offsetY] / (ry / rx);
    
    CGAffineTransform transform = CGAffineTransformMakeScale(1, ry / rx);
    CGContextConcatCTM(context, transform);
    CGGradientDrawingOptions extendOptions = kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation;
    
    CGContextDrawRadialGradient(context, _gradient, CGPointMake(fx, fy), 0, CGPointMake(cx, cy), rx, extendOptions);
}

@end

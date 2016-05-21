/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGLinearGradient.h"

#import "RCTConvert+RNSVG.h"
#import "RCTLog.h"

@implementation RNSVGLinearGradient
{
    CGGradientRef _gradient;
}

- (instancetype)initWithArray:(NSArray *)array
{
    if ((self = [super initWithArray:array])) {
        if (array.count < 5) {
            RCTLogError(@"-[%@ %@] expects 5 elements, received %@",
                        self.class, NSStringFromSelector(_cmd), array);
            return nil;
        }
        
        _points = [array subarrayWithRange:NSMakeRange(1, 4)];
        _gradient = CGGradientRetain([RCTConvert CGGradient:array offset:5]);
    }
    return self;
}

- (void)dealloc
{
    CGGradientRelease(_gradient);
}

- (void)paint:(CGContextRef)context
{
    CGGradientDrawingOptions extendOptions =
    kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation;
    
    CGRect box = CGContextGetClipBoundingBox(context);
    float height = CGRectGetHeight(box);
    float width = CGRectGetWidth(box);
    float midX = CGRectGetMidX(box);
    float midY = CGRectGetMidY(box);
    float offsetX = (midX - width / 2);
    float offsetY = (midY - height / 2);
    
    RNSVGPercentageConverter* convert = [[RNSVGPercentageConverter alloc] init];
    CGFloat x1 = [convert stringToFloat:(NSString *)[_points objectAtIndex:0] relative:width offset:offsetX];
    CGFloat y1 = [convert stringToFloat:(NSString *)[_points objectAtIndex:1] relative:height offset:offsetY];
    CGFloat x2 = [convert stringToFloat:(NSString *)[_points objectAtIndex:2] relative:width offset:offsetX];
    CGFloat y2 = [convert stringToFloat:(NSString *)[_points objectAtIndex:3] relative:height offset:offsetY];
    CGContextDrawLinearGradient(context, _gradient, CGPointMake(x1, y1), CGPointMake(x2, y2), extendOptions);
}

@end

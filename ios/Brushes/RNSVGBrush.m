/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGBrush.h"

#import "RCTDefines.h"

@implementation RNSVGBrush

- (instancetype)initWithArray:(NSArray *)data
{
    return [super init];
}

RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (BOOL)applyFillColor:(CGContextRef)context
{
    return NO;
}

- (BOOL)applyStrokeColor:(CGContextRef)context
{
    return NO;
}

- (CGFloat)getActualProp:(int)index relative:(CGFloat)relative offset:(CGFloat)offset
{
    id coord = [_points objectAtIndex:index];
    
    if ([coord isKindOfClass:[NSString class]]) {
        __block float matched = [coord floatValue];
        NSString *percentage = (NSString *)coord;
        NSRegularExpression *regex = [[NSRegularExpression alloc] initWithPattern:@"^(\\-?\\d+(?:\\.\\d+)?)%$" options:0 error:NULL];
        [regex enumerateMatchesInString:percentage
                                options:0
                                  range:NSMakeRange(0, percentage.length)
                             usingBlock:^(NSTextCheckingResult *result, NSMatchingFlags flags, BOOL *stop)
         {
             
             matched = [[percentage substringWithRange:NSMakeRange(result.range.location, result.range.length)] floatValue];
             matched = matched / 100 * relative + offset;
         }];
        
        return matched;
    } else {
        return [coord floatValue];
    }
}

- (void)paint:(CGContextRef)context
{
    // abstract
}

@end

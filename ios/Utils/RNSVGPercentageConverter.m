/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGPercentageConverter.h"

@implementation RNSVGPercentageConverter
{
    NSRegularExpression *percentageRegularExpression;
}

- (id)init
{
    self = [super init];
    if (self) {
        percentageRegularExpression = [[NSRegularExpression alloc] initWithPattern:@"^(\\-?\\d+(?:\\.\\d+)?)%$" options:0 error:nil];
    }
    return self;
}

- (NSRegularExpression *) getPercentageRegularExpression
{
    return percentageRegularExpression;
}

- (float) stringToFloat:(NSString *)percentage relative:(float)relative offset:(float)offset
{
    if ([self isPercentage:percentage] == NO) {
        return [percentage floatValue];
    } else {
        return [self percentageToFloat:percentage relative:relative offset:offset];
    }
}

- (float) percentageToFloat:(NSString *)percentage relative:(float)relative offset:(float)offset
{

    
    __block float matched;
    [percentageRegularExpression enumerateMatchesInString:percentage
                                                  options:0
                                                    range:NSMakeRange(0, percentage.length)
                                               usingBlock:^(NSTextCheckingResult *result, NSMatchingFlags flags, BOOL *stop)
     {
         
         matched = [[percentage substringWithRange:NSMakeRange(result.range.location, result.range.length)] floatValue];
         matched = matched / 100 * relative + offset;
     }];
    
    return matched;
}

- (BOOL) isPercentage:(NSString *) string
{
    return [percentageRegularExpression firstMatchInString:string options:0 range:NSMakeRange(0, [string length])] != NULL;
}

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

@interface RNSVGPercentageConverter : NSObject

- (NSRegularExpression *) getPercentageRegularExpression;

- (float) percentageToFloat:(NSString *)percentage relative:(float)relative offset:(float)offset;

- (float) stringToFloat:(NSString *)string relative:(float)relative offset:(float)offset;

- (BOOL) isPercentage:(NSString *) string;

@end
/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "RNSVGPath.h"
#import "RNSVGTextFrame.h"

@interface RNSVGTSpan : RNSVGPath

@property (nonatomic, assign) NSString *line;
@property (nonatomic, assign) NSString *dx;
@property (nonatomic, assign) NSString *dy;

@end

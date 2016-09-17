/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>
#import "RNSVGPath.h"
#import "RNSVGTextFrame.h"

@interface RNSVGSpan : RNSVGPath

@property (nonatomic, assign) CGFloat *dx;
@property (nonatomic, assign) CGFloat *dy;
@property (nonatomic, assign) NSString *px;
@property (nonatomic, assign) NSString *py;
@property (nonatomic, assign) CTFontRef font;

@end

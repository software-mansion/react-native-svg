/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import <UIKit/UIKit.h>
#import <PerformanceBezier/PerformanceBezier.h>
#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>
#import "RNSVGText.h"
#import "TextPathSide.h"
#import "TextPathMethod.h"
#import "TextPathMidLine.h"
#import "TextPathSpacing.h"
#import "TextLengthAdjust.h"
#import "AlignmentBaseline.h"

@interface RNSVGTSpan : RNSVGText

@property (nonatomic, strong) NSString *content;

@end

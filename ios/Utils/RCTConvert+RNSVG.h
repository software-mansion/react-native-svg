/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <QuartzCore/QuartzCore.h>
#import <CoreText/CoreText.h>
#import "RCTConvert+RNSVG.h"
#import "RNSVGCGFloatArray.h"
#import "RCTConvert.h"
#import "RNSVGCGFCRule.h"
#import "RNSVGVBMOS.h"
#import "RNSVGTextAnchor.h"

@class RNSVGBrush;

@interface RCTConvert (RNSVG)

+ (CGPathRef)CGPath:(id)json;
+ (RNSVGTextAnchor)RNSVGTextAnchor:(id)json;
+ (RNSVGCGFCRule)RNSVGCGFCRule:(id)json;
+ (RNSVGVBMOS)RNSVGVBMOS:(id)json;
+ (CTFontRef)RNSVGFont:(id)json;
+ (RNSVGCGFloatArray)RNSVGCGFloatArray:(id)json;
+ (RNSVGBrush *)RNSVGBrush:(id)json;

+ (NSArray *)RNSVGBezier:(id)json;
+ (CGRect)CGRect:(id)json offset:(NSUInteger)offset;
+ (CGColorRef)CGColor:(id)json offset:(NSUInteger)offset;
+ (CGGradientRef)CGGradient:(id)json offset:(NSUInteger)offset;

@end

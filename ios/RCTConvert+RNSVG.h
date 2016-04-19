/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <QuartzCore/QuartzCore.h>

#import "RNSVGBrush.h"
#import "RNSVGCGFloatArray.h"
#import "RNSVGTextFrame.h"
#import "RCTConvert.h"

@interface RCTConvert (RNSVG)

+ (CGPathRef)CGPath:(id)json;
+ (CTTextAlignment)CTTextAlignment:(id)json;
+ (RNSVGTextFrame)RNSVGTextFrame:(id)json;
+ (RNSVGCGFloatArray)RNSVGCGFloatArray:(id)json;
+ (RNSVGBrush *)RNSVGBrush:(id)json;

+ (CGPoint)CGPoint:(id)json offset:(NSUInteger)offset;
+ (CGRect)CGRect:(id)json offset:(NSUInteger)offset;
+ (CGColorRef)CGColor:(id)json offset:(NSUInteger)offset;
+ (CGGradientRef)CGGradient:(id)json offset:(NSUInteger)offset;

@end

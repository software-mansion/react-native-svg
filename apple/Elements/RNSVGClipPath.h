/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import "RNSVGContainer.h"
#import "RNSVGGroup.h"
#import "RNSVGSvgView.h"

@interface RNSVGClipPath : RNSVGGroup

- (BOOL)hasOverlappingChildren:(CGContextRef)context;
- (CGImageRef)createMask:(CGContextRef)context bounds:(CGRect *)outBounds;
- (BOOL)getUniformClipRule:(RNSVGCGFCRule *)outClipRule context:(CGContextRef)context;
- (BOOL)canUseFastPath:(CGContextRef)context clipRule:(RNSVGCGFCRule *)outClipRule;
- (BOOL)containsPoint:(CGPoint)point inPath:(CGPathRef)clipPath context:(CGContextRef)context;

@end

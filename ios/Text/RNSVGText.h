/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "UIBezierPath-Points.h"
#import "RNSVGPath.h"
#import "RNSVGTextFrame.h"
#import "RNSVGGlyphCache.h"

@interface RNSVGText : RNSVGPath

@property (nonatomic, assign) CTTextAlignment alignment;
@property (nonatomic, assign) RNSVGTextFrame textFrame;
@property (nonatomic, assign) CGPathRef path;

@end

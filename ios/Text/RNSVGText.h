/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "RNSVGGlyphPoint.h"
#import "RNSVGGroup.h"
#import "RNSVGTextAnchor.h"

@interface RNSVGText : RNSVGGroup

@property (nonatomic, assign) RNSVGTextAnchor textAnchor;
@property (nonatomic, strong) NSArray<NSNumber *> *deltaX;
@property (nonatomic, strong) NSArray<NSNumber *> *deltaY;
@property (nonatomic, strong) NSString *positionX;
@property (nonatomic, strong) NSString *positionY;
@property (nonatomic, strong) NSDictionary *font;

@property (nonatomic, assign) CGFloat lastX;
@property (nonatomic, assign) CGFloat lastY;
@property (nonatomic, assign) NSUInteger lastIndex;

- (CTFontRef)getComputedFont;
- (RNSVGGlyphPoint)getComputedGlyphPoint:(NSUInteger *)index glyphOffset:(CGPoint)glyphOffset;
- (RNSVGText *)getTextRoot;
- (CGAffineTransform)getTextPathTransform:(CGFloat)distance;
- (CGPathRef)getGroupPath:(CGContextRef)context;
- (void)resetTextPathAttributes;
- (void)traverseTextSuperviews:(BOOL (^)(__kindof RNSVGText *node))block;

@end

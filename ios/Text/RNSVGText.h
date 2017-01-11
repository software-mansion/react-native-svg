/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "RNSVGGroup.h"
#import "RNSVGTextAnchor.h"
#import "RNSVGGlyphContext.h"

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

- (RNSVGText *)getTextRoot;
- (void)releaseCachedPath;

- (RNSVGGlyphContext *)getGlyphContext;
- (void)pushGlyphContext;
- (void)popGlyphContext;
- (CTFontRef)getFontFromContext;
- (CGPoint)getGlyphPointFromContext:(CGPoint)offset glyphWidth:(CGFloat)glyphWidth;

@end

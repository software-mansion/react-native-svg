/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNSVGUIKit.h"

#import "RNSVGContainer.h"
#import "RNSVGPainter.h"
#import "RNSVGVBMOS.h"

@class RNSVGNode;
@class RNSVGMarker;
@class RNSVGMask;
@class RNSVGFilter;

@interface RNSVGSvgView : RNSVGView <RNSVGContainer>

@property (nonatomic, strong) RNSVGColor *color;
@property (nonatomic, strong) RNSVGLength *bbWidth;
@property (nonatomic, strong) RNSVGLength *bbHeight;
@property (nonatomic, assign) CGFloat minX;
@property (nonatomic, assign) CGFloat minY;
@property (nonatomic, assign) CGFloat vbWidth;
@property (nonatomic, assign) CGFloat vbHeight;
@property (nonatomic, strong) NSString *align;
@property (nonatomic, assign) RNSVGVBMOS meetOrSlice;
@property (nonatomic, assign) BOOL responsible;
@property (nonatomic, assign) BOOL active;
@property (nonatomic, assign) CGRect boundingBox;
@property (nonatomic, assign) CGAffineTransform initialCTM;
@property (nonatomic, assign) CGAffineTransform invInitialCTM;
@property (nonatomic, assign) CGAffineTransform viewBoxTransform;
@property (nonatomic, assign) UIEdgeInsets hitTestEdgeInsets;

/**
 * define <ClipPath></ClipPath> content as clipPath template.
 */
- (void)defineClipPath:(__kindof RNSVGNode *)clipPath clipPathName:(NSString *)clipPathName;

- (RNSVGNode *)getDefinedClipPath:(NSString *)clipPathName;

- (void)defineTemplate:(__kindof RNSVGNode *)definedTemplate templateName:(NSString *)templateName;

- (RNSVGNode *)getDefinedTemplate:(NSString *)templateName;

- (void)definePainter:(RNSVGPainter *)painter painterName:(NSString *)painterName;

- (RNSVGPainter *)getDefinedPainter:(NSString *)painterName;

- (void)defineMarker:(RNSVGMarker *)marker markerName:(NSString *)markerName;

- (RNSVGMarker *)getDefinedMarker:(NSString *)markerName;

- (void)defineMask:(RNSVGMask *)mask maskName:(NSString *)maskName;

- (RNSVGMask *)getDefinedMask:(NSString *)maskName;

- (void)defineFilter:(RNSVGFilter *)filter filterName:(NSString *)filterName;

- (RNSVGFilter *)getDefinedFilter:(NSString *)filterName;

- (NSString *)getDataURLWithBounds:(CGRect)bounds;

- (CGRect)getContextBounds;

- (void)drawRect:(CGRect)rect;

- (void)drawToContext:(CGContextRef)context withRect:(CGRect)rect;

- (CGAffineTransform)getViewBoxTransform;

- (CGAffineTransform)getInvViewBoxTransform;

@end

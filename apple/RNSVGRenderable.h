/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import "RNSVGUIKit.h"

#import "RNSVGBrush.h"
#import "RNSVGCGFCRule.h"
#import "RNSVGLength.h"
#import "RNSVGNode.h"
#import "RNSVGVectorEffect.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <rnsvg/RNSVGComponentDescriptors.h>

using namespace facebook::react;
#endif

@interface RNSVGRenderable : RNSVGNode

@property (class) RNSVGRenderable *contextElement;
@property (nonatomic, strong) RNSVGColor *color;
@property (nonatomic, strong) RNSVGBrush *fill;
@property (nonatomic, assign) CGFloat fillOpacity;
@property (nonatomic, assign) RNSVGCGFCRule fillRule;
@property (nonatomic, strong) RNSVGBrush *stroke;
@property (nonatomic, assign) CGFloat strokeOpacity;
@property (nonatomic, strong) RNSVGLength *strokeWidth;
@property (nonatomic, assign) CGLineCap strokeLinecap;
@property (nonatomic, assign) CGLineJoin strokeLinejoin;
@property (nonatomic, assign) CGFloat strokeMiterlimit;
@property (nonatomic, strong) NSArray<RNSVGLength *> *strokeDasharray;
@property (nonatomic, assign) CGFloat strokeDashoffset;
@property (nonatomic, assign) RNSVGVectorEffect vectorEffect;
@property (nonatomic, copy) NSArray<NSString *> *propList;
@property (nonatomic, assign) CGPathRef hitArea;
@property (nonatomic, strong) NSString *filter;

#ifdef RCT_NEW_ARCH_ENABLED
- (facebook::react::RNSVGRenderableShadowNode::ConcreteState::Shared)state;
#endif

- (void)setColor:(RNSVGColor *)color;

- (void)setHitArea:(CGPathRef)path;

- (NSArray<NSString *> *)getAttributeList;

- (void)mergeProperties:(__kindof RNSVGRenderable *)target;

- (void)resetProperties;

- (CGColor *)getCurrentColor;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateShadowNodeMetrics;
#endif

@end

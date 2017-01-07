/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/UIView+React.h>
#import "RNSVGCGFCRule.h"
#import "RNSVGSvgView.h"

/**
 * RNSVG nodes are implemented as base UIViews. They should be implementation for all basic
 ＊interfaces for all non-defination nodes.
 */

@interface RNSVGNode : UIView

@property (nonatomic, strong) NSString *name;
@property (nonatomic, assign) CGFloat opacity;
@property (nonatomic, assign) RNSVGCGFCRule clipRule;
@property (nonatomic, strong) NSString *clipPath;
@property (nonatomic, assign) BOOL responsible;
@property (nonatomic, assign) CGAffineTransform matrix;
@property (nonatomic, assign) BOOL active;

- (void)invalidate;

- (void)renderTo:(CGContextRef)context;

/**
 * renderTo will take opacity into account and draw renderLayerTo off-screen if there is opacity
 * specified, then composite that onto the context. renderLayerTo always draws at opacity=1.
 * @abstract
 */
- (void)renderLayerTo:(CGContextRef)context;

- (CGPathRef)getClipPath;

- (CGPathRef)getClipPath:(CGContextRef)context;

/**
 * clip node by clipPath or clipPathRef.
 */
- (void)clip:(CGContextRef)context;

/**
 * getPath will return the path inside node as a ClipPath.
 */
- (CGPathRef)getPath:(CGContextRef) context;


/**
 * run hitTest
 */
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event withTransform:(CGAffineTransform)transfrom;

- (RNSVGSvgView *)getSvgView;

/**
 * save element`s defination into svg element.
 */
- (void)saveDefinition;

/**
 * just for template node to merge target node`s properties into owned properties
 */
- (void)mergeProperties:(__kindof RNSVGNode *)target mergeList:(NSArray<NSString *> *)mergeList;

- (void)mergeProperties:(__kindof RNSVGNode *)target mergeList:(NSArray<NSString *> *)mergeList inherited:(BOOL)inherited;

/**
 * just for template node to reset all owned properties once after rendered.
 */
- (void)resetProperties;

- (void)beginTransparencyLayer:(CGContextRef)context;

- (void)endTransparencyLayer:(CGContextRef)context;

- (void)traverseSubviews:(BOOL (^)(RNSVGNode *node))block;

@end

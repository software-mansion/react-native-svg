/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "UIView+React.h"
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
@property (nonatomic, assign) CGPathRef clipPath; // convert clipPath="M0,0 L0,10 L10,10z" into path
@property (nonatomic, strong) NSString *clipPathRef; // use clipPath="url(#clip)" as ClipPath
@property (nonatomic, assign) BOOL responsible;


- (void)invalidate;

- (void)renderTo:(CGContextRef)context;

/**
 * renderTo will take opacity into account and draw renderLayerTo off-screen if there is opacity
 * specified, then composite that onto the context. renderLayerTo always draws at opacity=1.
 * @abstract
 */
- (void)renderLayerTo:(CGContextRef)context;

/**
 * clip node by clipPath or clipPathRef.
 */
- (void)clip:(CGContextRef)context;

/**
 * get clip path for current node.
 */
- (CGPathRef)getClipPath;

/**
 * getPath will return the path inside node as a ClipPath.
 */
- (CGPathRef)getPath:(CGContextRef) context;


/**
 * run hitTest
 */
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event;

- (RNSVGSvgView *)getSvgView;

/**
 * save element`s defination into svg element.
 */
- (void)saveDefination:(CGContextRef)context;

/**
 * remove element`s defination from svg element.
 */
- (void)removeDefination;

/**
 * merge owned properties into target element`s properties
 */
- (void)mergeProperties:(__kindof RNSVGNode *)target;

@end

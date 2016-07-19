/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>

#import "RNSVGContainer.h"

@class RNSVGNode;

@interface RNSVGSvgView : UIView <RNSVGContainer>

@property (nonatomic, assign) BOOL responsible;

/**
 * define <ClipPath></ClipPath> content as clipPath template.
 */
- (void)defineClipPath:(CGPathRef)clipPath clipPathRef:(NSString *)clipPathRef;

- (void)removeClipPath:(NSString *)clipPathRef;

- (CGPathRef)getDefinedClipPath:(NSString *)clipPathRef;

- (void)defineTemplate:(RNSVGNode *)template templateRef:(NSString *)templateRef;

- (void)removeTemplate:(NSString *)tempalteRef;

- (RNSVGNode *)getDefinedTemplate:(NSString *)tempalteRef;

@end

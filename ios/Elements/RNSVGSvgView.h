/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import "RNSVGBrushCOnverter.h"
#import "RNSVGContainer.h"

@class RNSVGNode;

@interface RNSVGSvgView : UIView <RNSVGContainer>

@property (nonatomic, assign) BOOL responsible;

/**
 * define <ClipPath></ClipPath> content as clipPath template.
 */
- (void)defineClipPath:(__kindof RNSVGNode *)clipPath clipPathRef:(NSString *)clipPathRef;

- (void)removeClipPath:(NSString *)clipPathRef;

- (RNSVGNode *)getDefinedClipPath:(NSString *)clipPathRef;


- (void)defineTemplate:(__kindof RNSVGNode *)template templateRef:(NSString *)templateRef;

- (void)removeTemplate:(NSString *)tempalteRef;

- (RNSVGNode *)getDefinedTemplate:(NSString *)tempalteRef;


- (void)defineBrushConverter:(RNSVGBrushConverter *)brushConverter brushConverterRef:(NSString *)brushConverterRef;

- (void)removeBrushConverter:(NSString *)brushConverterRef;

- (RNSVGBrushConverter *)getDefinedBrushConverter:(NSString *)brushConverterRef;

@end

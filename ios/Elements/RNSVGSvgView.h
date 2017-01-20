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
- (void)defineClipPath:(__kindof RNSVGNode *)clipPath clipPathName:(NSString *)clipPathName;

- (RNSVGNode *)getDefinedClipPath:(NSString *)clipPathName;

- (void)defineTemplate:(__kindof RNSVGNode *)template templateName:(NSString *)templateName;

- (RNSVGNode *)getDefinedTemplate:(NSString *)templateName;

- (void)defineBrushConverter:(RNSVGBrushConverter *)brushConverter brushConverterName:(NSString *)brushConverterName;

- (RNSVGBrushConverter *)getDefinedBrushConverter:(NSString *)brushConverterName;

- (NSString *)getDataURL;

- (CGRect)getContextBounds;

@end

/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import "RNSVGContainer.h"
#import "RNSVGNode.h"
#import "RNSVGCGFCRule.h"
#import "RNSVGSvgView.h"

@interface RNSVGGroup : RNSVGNode <RNSVGContainer>
@property (nonatomic, strong) NSString *asClipPath; // Current group is a <ClipPath /> element and asClipPath is its id.

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event;
- (RNSVGSvgView *)getSvgView;

@end

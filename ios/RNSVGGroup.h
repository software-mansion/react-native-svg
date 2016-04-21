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

@interface RNSVGGroup : RNSVGNode <RNSVGContainer>

@property (nonatomic, assign) CGPathRef clipPath;
@property (nonatomic, assign) RNSVGCGFCRule clipRule;

@end

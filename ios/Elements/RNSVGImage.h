/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import <React/RCTBridge.h>
#import "RNSVGRenderable.h"
#import "RNSVGVBMOS.h"
#import "RNSVGLength.h"

@interface RNSVGImage : RNSVGRenderable

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, assign) id src;
@property (nonatomic, strong) RNSVGLength* x;
@property (nonatomic, strong) RNSVGLength* y;
@property (nonatomic, strong) RNSVGLength* width;
@property (nonatomic, strong) RNSVGLength* height;
@property (nonatomic, strong) NSString *align;
@property (nonatomic, assign) RNSVGVBMOS meetOrSlice;

@end

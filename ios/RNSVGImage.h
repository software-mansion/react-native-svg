/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import "RNSVGRenderable.h"

@interface RNSVGImage : RNSVGRenderable
@property (nonatomic, strong) NSDictionary* layout;
@property (nonatomic, assign) id src;

- (CGFloat)getActualProp:(NSString *)name relative:(float)relative;

@end

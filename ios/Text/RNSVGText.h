/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import "RNSVGGroup.h"

@interface RNSVGText : RNSVGGroup

@property (nonatomic, assign) CTTextAlignment alignment;
@property (nonatomic, copy) NSArray<NSArray *> *path;

@end
